import React, { useEffect, useState } from 'react'
import { Box, VStack, Heading, Text, HStack, Input, Center, Button, Spinner, useBreakpointValue } from '@chakra-ui/react'
import Header from '../components/Header'
import { useLocation, useNavigate } from 'react-router-dom'

import { useStudentStore } from '../store/student.js'
import { useHomeworkStore } from '../store/homework.js'
import { FaArrowLeft } from 'react-icons/fa';

import { NumberInputField, NumberInputRoot } from '../components/ui/number-input';
import Dialog_Delete from '../components/Dialog_Delete.jsx'

import { Toaster, toaster } from "../components/ui/toaster"


// TODO: fix bug in which a new assignment is added to a student if the homework is entered but not saved
const Homework = () => {

    const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })
    const disappearSaveButton = useBreakpointValue({ "min": "none", "xs": "flex" })

    const location = useLocation();
    const homeworkId = location.state?.homeworkId;
    const selectedClass = location.state?.selectedClass;

    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/scores/homework', { state: { selectedClass: selectedClass } })
    }

    const { fetchHomeworks, deleteHomework, updateHomework, homeworks } = useHomeworkStore()
    const { fetchStudents, updateStudent, students } = useStudentStore()

    const [localStudents, setLocalStudents] = useState([])
    const [allStudents, setAllStudents] = useState([])

    const [currentHomework, setCurrentHomework] = useState({})
    const [currentMeanGrade, setCurrentMeanGrade] = useState(-1)
    const [settings, setSettings] = useState({})

    const [studentScores, setStudentScores] = useState({})
    const [studentGrades, setStudentGrades] = useState({})
    const [studentRanks, setStudentRanks] = useState({})
    const [search, setSearch] = useState("")
    const [triggerLoad, setTriggerLoad] = useState(false)
    const [triggerSave, setTriggerSave] = useState(false)

    const [isStatsLoading, setIsStatsLoading] = useState(true)

    // launch once on load, get students, homeworks, and settings
    useEffect(() => {
        async function fetchAll() {
            console.log("Fetching settings, homeworks, and students...");
            const res = await fetch("/api/settings");
            const data = await res.json();
            setSettings(data.data);

            await fetchStudents();
            await fetchHomeworks();
            setTriggerLoad(true);
        }

        fetchAll();
    }, []);

    // wait for students, homework, and settings then execute
    useEffect(() => {
        if (!homeworkId || !settings.cutoffs) return;

        console.log("Processing students and homeworks...");

        const homework = homeworks.find(hw => hw._id === homeworkId);
        setCurrentHomework(homework);

        const classStudents = students.filter(student => student.class === Number(selectedClass.slice(-1)));

        const defaultScores = {};
        const newGrades = {};

        // fetch existing saved scores or default to full points
        setTimeout(() => {
            classStudents.forEach(student => {
                const savedScore = student.homeworkLog?.[homeworkId] ?? homework.points;
                defaultScores[student._id] = savedScore;

                const percent = (savedScore / homework.points) * 100;
                let grade = "F";
                if (percent >= settings.cutoffs.A) grade = "A";
                else if (percent >= settings.cutoffs.B) grade = "B";
                else if (percent >= settings.cutoffs.C) grade = "C";
                else if (percent >= settings.cutoffs.D) grade = "D";

                newGrades[student._id] = student.homeworkLog[homeworkId] == null ? grade : "-";
            });

        }, 0)

        setAllStudents(classStudents);
        setStudentScores(defaultScores);
        setStudentGrades(newGrades);
        setLocalStudents(classStudents.sort((a, b) => studentScores[b._id] - studentScores[a._id]));
        setTriggerSave(true);

    }, [triggerLoad]);

    // trigger save to properly load everything
    useEffect(() => {
        if (!triggerSave) return;
        handleSaveButton()
    }, [triggerSave]);

    const handleSaveButton = async (fromButton) => {
        setIsStatsLoading(true)
        const updatedGrades = {};
        const updatedStudents = allStudents.map(student => {
            const newScore = studentScores[student._id];
            const percent = (newScore / currentHomework.points) * 100;

            let grade = "F";
            if (percent >= settings.cutoffs.A) grade = "A";
            else if (percent >= settings.cutoffs.B) grade = "B";
            else if (percent >= settings.cutoffs.C) grade = "C";
            else if (percent >= settings.cutoffs.D) grade = "D";

            updatedGrades[student._id] = grade

            return {
                ...student,
                homeworkLog: { ...student.homeworkLog, [currentHomework._id]: newScore },
            };
        });

        updatedStudents.forEach(student => updateStudent(student._id, student));

        setStudentGrades(updatedGrades);
        setLocalStudents(updatedStudents.sort((a, b) => studentScores[b._id] - studentScores[a._id]));

        let currentRank = 1;
        const newRanks = {};
        let sum = 0;

        let sortedScores = Object.entries(studentScores).sort((a, b) => b[1] - a[1])

        for (let i = 0; i < sortedScores.length; ++i) {
            let [id, score] = sortedScores[i];

            sum += Number(score);

            if (i > 0 && score === sortedScores[i - 1][1]) {
                newRanks[id] = newRanks[sortedScores[i - 1][0]];
            } else {
                newRanks[id] = currentRank;
            }

            currentRank++;
        }

        setStudentRanks(newRanks);

        const { success } = await updateHomework(homeworkId, {
            ...currentHomework,
            meanGrade: sum / sortedScores.length
        })

        setCurrentMeanGrade(sortedScores.length != 0 ? sum / sortedScores.length : -1);

        setIsStatsLoading(false)

        if (fromButton) {
            toaster.create({
                title: success ? "Homework saved" : "Error saving homework",
                type: success ? "success" : "error",
                duration: "2000"
            })
        }
    };

    useEffect(() => {
        setLocalStudents(allStudents.filter(student => student.name.toLowerCase().includes(search.toLowerCase())))

    }, [search])


    const [dialog, setDialog] = useState(false);
    const handleDeleteButton = () => {
        setDialog(!dialog);
    }

    const handleDeleteHomework = () => {
        students.forEach(student => {
            const updatedHomeworkLog = { ...student.homeworkLog };
            delete updatedHomeworkLog[homeworkId];

            updateStudent(student._id, {
                ...student,
                homeworkLog: updatedHomeworkLog
            });
        });

        deleteHomework(homeworkId);

    };

    const deleteButtonBreakpoint = useBreakpointValue({ "xxs": "", sm: "Homework" });


    if (!currentHomework.name || !currentHomework.points || !localStudents) {
        return (
            <Center minH="100vh" bg="gray.100">
                <Spinner color="green.500" borderWidth="4px" cosize="xl" />
            </Center>
        );
    }

    return (
        <Box
            display="flex"
            flexDir="column"
            minH={"100vh"}
            maxW={"100vw"}
            bg={"gray.100"}
            color="gray.900"
        >
            <Toaster />

            <Header></Header>

            {dialog && <Dialog_Delete handleBack={handleBack} delete={handleDeleteHomework} id={homeworkId} setDialog={setDialog}></Dialog_Delete>}

            <Box
                w="100%"
                paddingTop="1rem"
                paddingBottom="1rem"
                minHeight="4rem"
                display={disappearOnMin}
                //flexDirection={"column"}
                flexWrap="wrap"
                alignItems={"flex-start"}
                overflow="visible"
            >

                <HStack
                    marginRight="10%"
                    w="70%"
                    maxW="40rem"
                    color="gray.600"
                    fontSize="2xl"
                    fontWeight={"400"}
                    whiteSpace={"normal"}
                    wordBreak="break-word"
                    display="flex"
                    flexDir="row"
                    justifyContent="space-between"
                >
                    <Box
                        display="flex"
                        flexDir="row"
                        alignItems="center">
                        <Box ml="1rem" mt="0.25rem"
                            cursor={"pointer"}
                            onClick={handleBack}>
                            <FaArrowLeft size="1.5rem" className='FaArrowLeft' />
                        </Box>
                        <Text ml="1rem">{currentHomework.name}</Text>
                    </Box>
                </HStack>
            </Box>



            <VStack gap="0" display={disappearOnMin} flex="1" w="100%">

                <Box
                    top="5rem"
                    position="absolute"
                    w="80%"
                    display={disappearSaveButton}
                    justifyContent="flex-end"
                    alignItems="center"
                    maxW="40rem"
                    minHeight="4rem"
                >
                    {!isStatsLoading ? (
                        <Button
                            mt="0.2rem"
                            borderRadius={"4rem"}
                            w={{ "xxs": "3.5rem", "xs": "5rem", sm: "6rem" }}
                            bg="green.500"
                            color="gray.100"
                            fontSize={{ sm: "lg", lg: "xl" }}
                            transition="all 0.3s"
                            _hover={{ transform: "translateY(-3px)" }}
                            onClick={() => {
                                handleSaveButton(true)
                            }}
                        >Save</Button>
                    ) : (
                        <Box
                            w={{ "xxs": "3.5rem", "xs": "5rem", sm: "6rem" }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            <Spinner color="green.500" borderWidth="4px" cosize="xl" />
                        </Box>
                    )}

                </Box>

                <Box
                    w="80%"
                    maxW="40rem"
                >
                    {isStatsLoading ? (
                        <Box
                            borderRadius="1.2rem"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDir="column"
                            bg="gray.200"
                            h="11rem">
                            <Spinner mr="1rem" color="gray.400" borderWidth="4px" cosize="xl" />
                        </Box>
                    ) : (
                        <Box
                            borderRadius="1.2rem"
                            paddingLeft="1rem"
                            display="flex"
                            flexDir="column"
                            bg="gray.200"
                            h="11rem">
                            <Text lineClamp="1" marginRight="1rem" marginTop="1rem">Points: {currentHomework.points}</Text>
                            <Text lineClamp="1" marginRight="1rem" marginTop="1rem">Subject: {currentHomework.subject}</Text>
                            <Text lineClamp="1" marginRight="1rem" marginTop="1rem">Class Mean Grade: {currentMeanGrade == -1 ? "Not yet scored" : (((currentMeanGrade / currentHomework.points) * 100).toFixed(1) + "%   ,  " + currentMeanGrade.toFixed(2) + " / " + currentHomework.points.toFixed(2))} </Text>
                            <Text lineClamp="1" marginRight="1rem" marginY="1rem">Date Created: {String(currentHomework.createdAt).slice(0, 10)} </Text>
                        </Box>
                    )}
                </Box>

                <Box w="80%"
                    maxW="40rem"
                    paddingBottom="1rem"
                >

                    <HStack justifyContent="center" marginTop="2rem">
                        <Heading
                            marginRight="0.5rem"
                            marginBottom="0.3rem"
                            color="gray.600"
                            fontWeight={"400"}
                            fontSize="lg"
                        >Search: </Heading>

                        <Input
                            placeholder="Begin typing name..."
                            style={{ boxShadow: 'var(--box-shadow-classic)' }}
                            border="none"
                            borderRadius="0.5rem"
                            marginBottom="0.3rem"
                            transition='all 0.3s'
                            w="22rem"
                            _hover={{ transform: "translateY(-3px)" }}
                            value={search}
                            onChange={(e) => { setSearch(e.target.value) }}
                        ></Input>

                    </HStack>
                </Box>

                <Box
                    w="80%"
                    flex="1"
                    maxW="40rem">
                    <VStack
                        w="100%"
                        flex="1"
                        gap="0rem"
                        display="flex"
                    >
                        <HStack
                            flex="1"
                            minH="3rem"
                            gap="0"
                            w="100%"
                            maxW="40rem"
                        >
                            <Box flex="3">
                                <Text ml="1rem" maxW="10rem">Name</Text>
                            </Box>
                            <Center flex="2" marginRight={{ "xxs": "0.4rem", "xs": "0.5rem", sm: "0rem" }}>
                                <Text>Score</Text>
                            </Center>
                            <Center flex="1">
                                <Text>Grade</Text>
                            </Center>
                            <Center flex="1" marginLeft={{ "xxs": "0.4rem", "xs": "0.5rem", sm: "0rem" }}>
                                <Text>Rank</Text>
                            </Center>
                        </HStack>

                        <VStack
                            flex="10"
                            bg="gray.100"
                            w="100%"
                            maxW="40rem"
                            minH="12rem"
                            gap="0rem"
                            alignItems={"center"} >

                            {localStudents.length !== 0 ?

                                localStudents.map((student, index) => (
                                    <Box
                                        key={index}
                                        w="100%"
                                        h="3rem"
                                        bg={index % 2 === 0 ? "gray.200" : "gray.300"}
                                        display="flex"
                                        alignItems="center">
                                        <HStack
                                            display="flex"
                                            w="100%"
                                            gap="0">
                                            <Box flex="3">
                                                <Text
                                                    ml="1rem"
                                                    maxW={{ "xxs": "3.5rem", "xs": "5.5rem", sm: "8rem", md: "14rem" }}
                                                    truncate>{student.name}</Text>
                                            </Box>
                                            <Center flex="2">
                                                <NumberInputRoot
                                                    defaultValue={currentHomework.points}
                                                    minW="4rem"
                                                    w={{ "xxs": "70%", "xs": "75%", sm: "90%", md: "100%" }}
                                                    h="90%"
                                                    borderRadius="0.25rem"
                                                    step={1}
                                                    value={studentScores[student._id]}
                                                    onValueChange={(e) => {
                                                        const newValue = Math.max(0, Math.min(currentHomework.points, e.value))
                                                        setStudentScores(prevScores => ({
                                                            ...prevScores,
                                                            [student._id]: newValue
                                                        }))
                                                    }}
                                                    min={0}
                                                    max={currentHomework.points}
                                                    style={{ boxShadow: 'var(--box-shadow-classic)' }}
                                                >
                                                    <NumberInputField borderWidth={"0"} />
                                                </NumberInputRoot>
                                            </Center>
                                            <Center flex="1">
                                                <Text>{studentGrades[student._id] || "-"}</Text>
                                            </Center>
                                            <Center flex="1">
                                                <Text>{studentRanks[student._id] || "-"}</Text>
                                            </Center>
                                        </HStack>
                                    </Box>
                                )) :
                                <Box
                                    w="100%"
                                    h="6rem"
                                    bg="gray.200"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center">
                                    No Students Found
                                </Box>
                            }

                        </VStack>
                    </VStack>
                </Box>

                <HStack
                    justifyContent="space-between"
                    maxW="40rem"
                    w="80%"
                    paddingBottom="2rem"
                    paddingTop="2rem"
                >

                    <Box onClick={handleBack} p="0.5rem" cursor="pointer">
                        <FaArrowLeft size="1.5rem" className='FaArrowLeft' />
                    </Box>

                    <Box display="flex" flexDir="row">
                        <Button
                            borderRadius={"4rem"}
                            w={{ "xxs": "4.5rem", "xs": "6rem", sm: "12rem" }}
                            borderWidth="2px"
                            borderColor={"green.500"}
                            bg="none"
                            color="green.500"
                            fontSize={{ sm: "lg", lg: "xl" }}
                            transition="all 0.3s"
                            onClick={handleDeleteButton}
                            _hover={{ transform: "translateY(-3px)" }}
                        >Delete {deleteButtonBreakpoint}</Button>


                        {!isStatsLoading ? (
                            <Button
                                borderRadius={"4rem"}
                                w={{ "xxs": "3.5rem", "xs": "5rem", sm: "6rem" }}
                                bg="green.500"
                                color="gray.100"
                                fontSize={{ sm: "lg", lg: "xl" }}
                                transition="all 0.3s"
                                _hover={{ transform: "translateY(-3px)" }}
                                marginLeft={{ "xxs": "0.5rem", "xs": "1rem", sm: "1.5rem" }}
                                onClick={() => {
                                    handleSaveButton(true)
                                }}
                            >Save</Button>
                        ) : (
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                w={{ "xxs": "3.5rem", "xs": "5rem", sm: "6rem" }}
                                marginLeft={{ "xxs": "0.5rem", "xs": "1rem", sm: "1.5rem" }}
                            >  
                                <Spinner color="green.500" borderWidth="4px" cosize="xl" />
                            </Box>
                        )}
                    </Box>
                </HStack>

            </VStack>
        </Box>
    )
}

export default Homework