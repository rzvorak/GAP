import React, { useEffect, useState } from 'react'
import { Box, VStack, Heading, Text, HStack, Input, Center, Button, Spinner, useBreakpointValue, SimpleGrid } from '@chakra-ui/react'
import Header from '../components/Header'
import { useLocation, useNavigate } from 'react-router-dom'

import { useStudentStore } from '../store/student.js'
import { useExamStore } from '../store/exam.js'
import { FaArrowLeft } from 'react-icons/fa';

import { NumberInputField, NumberInputRoot } from '../components/ui/number-input';
import Dialog_Delete from '../components/Dialog_Delete.jsx'

import { Toaster, toaster } from "../components/ui/toaster"

// TODO: save toast still needed
const Exam = () => {

    const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })
    const disappearSaveButton = useBreakpointValue({ "min": "none", "xs": "flex" })


    const location = useLocation();
    const examId = location.state?.examId;
    const selectedClass = location.state?.selectedClass;
    const selectedType = location.state?.selectedType;

    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/scores/exam', { state: { selectedClass: selectedClass, selectedType: selectedType } })
    }

    const { fetchExams, deleteExam, updateExam, exams } = useExamStore()
    const { fetchStudents, updateStudent, students } = useStudentStore()

    const [localStudents, setLocalStudents] = useState([])
    const [allStudents, setAllStudents] = useState([])

    const [currentExam, setCurrentExam] = useState({})
    const [currentMeanGrade, setCurrentMeanGrade] = useState(-1)
    const [settings, setSettings] = useState({})
    const [subjects, setSubjects] = useState({})

    const [studentScores, setStudentScores] = useState({})
    const [studentOverallScores, setStudentOverallScores] = useState({})
    const [studentGrades, setStudentGrades] = useState({})
    const [studentRanks, setStudentRanks] = useState({})
    const [search, setSearch] = useState("")
    const [triggerLoad, setTriggerLoad] = useState(false)
    const [triggerSave, setTriggerSave] = useState(false)

    const [isStatsLoading, setIsStatsLoading] = useState(true)

    // launch once on load, get students, exams, and settings
    useEffect(() => {
        async function fetchAll() {
            console.log("Fetching settings, exams, and students...");
            const res = await fetch("/api/settings");
            const data = await res.json();
            setSettings(data.data);
            setSubjects(data.data.subjects)

            await fetchStudents();
            await fetchExams();
            setTriggerLoad(true);
        }

        fetchAll();
    }, []);

    // wait for students, exams, and settings then execute
    useEffect(() => {
        if (!examId || !settings.cutoffs || !settings.subjects) return;

        console.log("Processing students and exams...");

        const exam = exams.find(exam => exam._id === examId);
        setCurrentExam(exam);

        const classStudents = students.filter(student => student.class === Number(selectedClass.slice(-1)));

        const defaultScores = {};
        const defaultOverallScores = {};
        const newGrades = {};

        // fetch existing saved scores or default to full points
        setTimeout(() => {
            classStudents.forEach(student => {
                const savedScore = student.examLog?.[examId] ?? subjects[Number(selectedClass.slice(-1))].reduce((acc, subject) => {
                    acc[subject] = exam.points;
                    return acc;
                }, {});
                defaultScores[student._id] = savedScore;

                let overallScore = 0;
                Object.values(savedScore).forEach(subjectScore => {
                    overallScore += subjectScore;
                })

                defaultOverallScores[student._id] = overallScore;

                const percent = (overallScore / (exam.points * subjects[Number(selectedClass.slice(-1))].length)) * 100;
                let grade = "F";
                if (percent >= settings.cutoffs.A) grade = "A";
                else if (percent >= settings.cutoffs.B) grade = "B";
                else if (percent >= settings.cutoffs.C) grade = "C";
                else if (percent >= settings.cutoffs.D) grade = "D";

                newGrades[student._id] = student.examLog[examId] == null ? grade : "-";
            });

        }, 0)

        setAllStudents(classStudents);
        setStudentScores(defaultScores);
        setStudentOverallScores(defaultOverallScores)
        setStudentGrades(newGrades);
        setLocalStudents(classStudents.sort((a, b) => studentOverallScores[b._id] - studentOverallScores[a._id]));
        setTriggerSave(true);

    }, [triggerLoad]);

    // trigger save to properly load everything
    useEffect(() => {
        if (!triggerSave) return;
        handleSaveButton(false)
    }, [triggerSave]);

    const handleSaveButton = async (fromButton) => {
        setIsStatsLoading(true)
        const updatedGrades = {};
        const updatedOverallScores = {};
        const updatedStudents = allStudents.map(student => {
            const newScore = studentScores[student._id];

            let overallScore = 0;
            Object.values(newScore).forEach(subjectScore => {
                overallScore += subjectScore;
            })

            updatedOverallScores[student._id] = overallScore;

            const percent = (overallScore / (subjects[currentExam.class] * currentExam.points)) * 100;

            let grade = "F";
            if (percent >= settings.cutoffs.A) grade = "A";
            else if (percent >= settings.cutoffs.B) grade = "B";
            else if (percent >= settings.cutoffs.C) grade = "C";
            else if (percent >= settings.cutoffs.D) grade = "D";

            updatedGrades[student._id] = grade

            return {
                ...student,
                examLog: { ...student.examLog, [currentExam._id]: newScore },
            };
        });

        updatedStudents.forEach(student => updateStudent(student._id, student));

        setStudentOverallScores(updatedOverallScores)
        setStudentGrades(updatedGrades);
        setLocalStudents(updatedStudents.sort((a, b) => updatedOverallScores[b._id] - updatedOverallScores[a._id]));

        let currentRank = 1;
        const newRanks = {};
        let sum = 0;

        let sortedScores = Object.entries(updatedOverallScores).sort((a, b) => b[1] - a[1])

        for (let i = 0; i < sortedScores.length; ++i) {
            let [id, score] = sortedScores[i];
            console.log(score)

            sum += Number(score);

            if (i > 0 && score === sortedScores[i - 1][1]) {
                newRanks[id] = newRanks[sortedScores[i - 1][0]];
            } else {
                newRanks[id] = currentRank;
            }

            currentRank++;
        }

        setStudentRanks(newRanks);

        const { success } = await updateExam(examId, {
            ...currentExam,
            meanGrade: sum / sortedScores.length
        })

        setCurrentMeanGrade(sortedScores.length != 0 ? sum / sortedScores.length : -1);

        setIsStatsLoading(false)

        if (fromButton) {
            toaster.create({
                title: success ? "Exam saved" : "Error saving exam",
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

    const handleDeleteExam = () => {
        students.forEach(student => {
            const updatedExamLog = { ...student.examLog };
            delete updatedExamLog[examId];

            updateStudent(student._id, {
                ...student,
                examLog: updatedExamLog
            });
        });

        deleteExam(examId);
    };

    const calculateGrade = (percent) => {
        if (percent < 0) return "-"
        let grade = "F";
        if (percent >= settings.cutoffs.A) grade = "A";
        else if (percent >= settings.cutoffs.B) grade = "B";
        else if (percent >= settings.cutoffs.C) grade = "C";
        else if (percent >= settings.cutoffs.D) grade = "D";
        return grade;
    }

    const deleteButtonBreakpoint = useBreakpointValue({ "xxs": "", sm: "Exam" });


    if (!currentExam.type || !currentExam.points || !localStudents) {
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
            <Header></Header>
            <Toaster></Toaster>

            {dialog && <Dialog_Delete handleBack={handleBack} delete={handleDeleteExam} id={examId} setDialog={setDialog}></Dialog_Delete>}

            <Box
                w="100%"
                paddingTop="1rem"
                paddingBottom="1rem"
                minHeight="4rem"
                display={disappearOnMin}
                flexDirection={"column"}
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
                        <Heading
                            marginLeft="1rem"
                            marginRight="1rem"
                            color="gray.600"
                            fontSize="2xl"
                            fontWeight={"400"}
                            whiteSpace={"normal"}
                            wordBreak="break-word"
                        >{currentExam.type.charAt(0).toUpperCase()}{currentExam.type.slice(1)} Exam ({currentExam.month} {currentExam.createdAt.slice(0, 4)})</Heading>
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
                            h="8.5rem">
                            <Spinner mr="1rem" color="gray.400" borderWidth="4px" cosize="xl" />
                        </Box>
                    ) : (
                        <Box
                            borderRadius="1.2rem"
                            paddingLeft="1rem"
                            display="flex"
                            flexDir="column"
                            bg="gray.200">
                            <Text lineClamp="1" marginRight="1rem" marginTop="1rem">Points: {currentExam.points}</Text>
                            <Text lineClamp="1" marginRight="1rem" marginTop="1rem">Class Mean Grade: {currentMeanGrade == -1 ? "Not yet scored" : (((currentMeanGrade / (subjects[currentExam.class].length * currentExam.points)) * 100).toFixed(1) + "%")}</Text>
                            <Text lineClamp="1" marginRight="1rem" marginY="1rem">Date Created: {String(currentExam.createdAt).slice(0, 10)} </Text>
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
                                        h={subjects[currentExam.class].length > 6 ? "22rem" : "15rem"}
                                        bg={index % 2 === 0 ? "gray.200" : "gray.300"}
                                        display="flex"
                                        alignItems="center">

                                        <VStack
                                            display="flex"
                                            w="100%"
                                            h="100%"
                                            gap="0">

                                            <Box
                                                flex="1"
                                                w="100%"
                                                display="flex"
                                                alignItems="center">
                                                <Text
                                                    flex="2"
                                                    ml="1rem"
                                                    pr="1rem"
                                                    fontWeight="500"
                                                    //maxW={{ "xxs": "3.5rem", "xs": "5.5rem", sm: "10rem", md: "14rem" }}
                                                    truncate
                                                >{student.name}</Text>
                                                <Text
                                                    textAlign="center"
                                                    flex="1"
                                                    maxW={{ "xxs": "3.5rem", "xs": "5.5rem", sm: "6rem", md: "14rem" }}
                                                    truncate
                                                >{((studentOverallScores[student._id]) / (subjects[currentExam.class].length * currentExam.points) * 100).toFixed(2)}%</Text>
                                                <Text
                                                    textAlign="center"
                                                    flex="1"
                                                    maxW={{ "xxs": "1.5rem", "xs": "2rem", sm: "3rem", md: "6rem" }}
                                                    truncate
                                                >{calculateGrade((studentOverallScores[student._id]) / (subjects[currentExam.class].length * currentExam.points) * 100)}</Text>
                                                <Text
                                                    textAlign="center"
                                                    flex="1"
                                                    mr="0.5rem"
                                                    maxW={{ "xxs": "3.5rem", "xs": "5.5rem", sm: "6rem", md: "14rem" }}
                                                    truncate
                                                >Rank: {studentRanks[student._id] || "-"}</Text>
                                            </Box>

                                            <SimpleGrid
                                                columns={3}
                                                pb="1rem"
                                            >

                                                {subjects[currentExam.class].map((subject, index) => (
                                                    <VStack key={index} ml="0.5rem" mr="0.5rem" mb="0.5rem">
                                                        <Text pt="0.5rem" truncate maxW={{ "xxs": "3rem", "xs": "6rem", sm: "8rem", }} >{subject}</Text>
                                                        <NumberInputRoot
                                                            minW="4rem"
                                                            w={{ "xxs": "70%", "xs": "75%", sm: "90%", md: "100%" }}
                                                            h="50%"
                                                            borderRadius="0.25rem"
                                                            step={1}
                                                            value={studentScores[student._id][subject]}
                                                            onValueChange={(e) => {
                                                                const newValue = Math.max(0, Math.min(currentExam.points, e.value))
                                                                setStudentScores(prevScores => ({
                                                                    ...prevScores,
                                                                    [student._id]: {
                                                                        ...prevScores[student._id],
                                                                        [subject]: newValue
                                                                    }
                                                                }))
                                                            }}
                                                            min={0}
                                                            max={currentExam.points}
                                                            style={{ boxShadow: 'var(--box-shadow-classic)' }}
                                                        >
                                                            <NumberInputField borderWidth={"0"} />
                                                        </NumberInputRoot>
                                                    </VStack>

                                                ))}

                                            </SimpleGrid>

                                        </VStack>

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

export default Exam