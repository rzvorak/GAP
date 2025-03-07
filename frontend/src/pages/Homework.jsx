import React, { useEffect, useState } from 'react'
import { Box, VStack, Heading, Text, HStack, Input, Center, Button, Spinner, SegmentGroupItemHiddenInput } from '@chakra-ui/react'
import Header from '../components/Header'
import { useLocation, useNavigate } from 'react-router-dom'

import { useStudentStore } from '../store/student.js'
import { useHomeworkStore } from '../store/homework.js'
import { FaArrowLeft } from 'react-icons/fa';

import { NumberInputField, NumberInputRoot, NumberInputLabel } from '../components/ui/number-input';
import Dialog_Delete from '../components/Dialog_Delete.jsx'



const Homework = () => {
    const location = useLocation();
    const homeworkId = location.state?.homeworkId;
    const selectedClass = location.state?.selectedClass;

    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/scores/homework', { state: { selectedClass: selectedClass } })
    }

    const { fetchHomeworks, deleteHomework, homeworks } = useHomeworkStore()
    const { fetchStudents, updateStudent, students } = useStudentStore()

    const [localStudents, setLocalStudents] = useState([])
    const [allStudents, setAllStudents] = useState([])

    const [currentHomework, setCurrentHomework] = useState({})
    const [settings, setSettings] = useState({})

    const [studentScores, setStudentScores] = useState({})
    const [studentGrades, setStudentGrades] = useState({})
    const [studentRanks, setStudentRanks] = useState({})
    const [search, setSearch] = useState("")
    const [triggerLoad, setTriggerLoad] = useState(false)
    const [triggerSave, setTriggerSave] = useState(false)
    
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
        if (!homeworkId || !settings.cutoffs || homeworks.length === 0 || students.length === 0) return;
    
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
        
                newGrades[student._id] = student.homeworkLog[homeworkId] ? grade : "-";
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

    
    useEffect(() => {
        if (search === "") return;
        console.log("setting local students in problem")
        
        setLocalStudents(allStudents.filter(student => student.name.toLowerCase().includes(search.toLowerCase())));
        console.log("finished setting local students in problem")
        
    }, [search, allStudents]);

    
    const handleSaveButton = () => {
        console.log("Saving student scores...");
    
        const updatedGrades = {};
        const updatedStudents = allStudents.map(student => {
            const newScore = studentScores[student._id];
            const percent = (newScore / currentHomework.points) * 100;
    
            let grade = "F";
            if (percent >= settings.cutoffs.A) grade = "A";
            else if (percent >= settings.cutoffs.B) grade = "B";
            else if (percent >= settings.cutoffs.C) grade = "C";
            else if (percent >= settings.cutoffs.D) grade = "D";
    
            updatedGrades[student._id] = grade;
    
            return {
                ...student,
                homeworkLog: {
                    ...student.homeworkLog,
                    [currentHomework._id]: newScore,
                },
            };
        });
    
        updatedStudents.forEach(student => updateStudent(student._id, student));
    
        setStudentGrades(updatedGrades);
        setLocalStudents(updatedStudents.sort((a, b) => studentScores[b._id] - studentScores[a._id]));
    };


    const [dialog, setDialog] = useState(false);
    const handleDeleteButton = () => {
        setDialog(!dialog);
    }

    if (!currentHomework || !localStudents ) {
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

            {dialog && <Dialog_Delete handleBack={handleBack} delete={deleteHomework} id={homeworkId} currentAssignment={currentHomework.name} setDialog={setDialog}></Dialog_Delete>}

            <VStack
                w="100%">
                <Box
                    w="100%"
                    h={{ sm: "4rem" }}
                    display="flex"
                    alignItems={"center"}>
                    <Heading
                        marginLeft="1rem"
                        color="gray.600"
                        fontSize="2xl"
                        fontWeight={"400"}
                    >{currentHomework.name}</Heading>
                </Box>
            </VStack>

            <VStack gap="0" display="flex" flex="1" w="100%">

                <Box
                    w="80%"
                    flex="1"
                    maxW="40rem"
                >
                    <Box
                        borderRadius="1.2rem"
                        paddingLeft="1rem"
                        display="flex"
                        flexDir="column"
                        bg="gray.200">
                        <Text marginTop="1rem">Points: {currentHomework.points}</Text>
                        <Text marginTop="1rem">Subject: {currentHomework.subject}</Text>
                        <Text marginTop="1rem">Class Mean Grade: {currentHomework.meanGrade == -1 ? "Not yet scored" : currentHomework.meanGrade} </Text>
                        <Text marginY="1rem">Date Created: {String(currentHomework.createdAt).slice(0, 10)} </Text>
                    </Box>
                </Box>

                <Box w="80%"
                    flex="5"
                    //bg="green.100"
                    maxW="40rem"
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
                    flex="3"
                    //bg="blue.100"
                    maxW="40rem">
                    <VStack
                        w="100%"
                        flex="1"
                        gap="0rem"
                        display="flex"
                        paddingBottom="2rem"
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
                            <Center flex="2">
                                <Text>Score</Text>
                            </Center>
                            <Center flex="1">
                                <Text>Grade</Text>
                            </Center>
                            <Center flex="1">
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

                            {localStudents.length !== 0  ?

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
                                                    maxW={{ sm: "12rem", md: "20rem" }}
                                                    truncate>{student.name}</Text>
                                            </Box>
                                            <Center flex="2">
                                                <NumberInputRoot
                                                    defaultValue={currentHomework.points}
                                                    w="100%"
                                                    h="90%"
                                                    borderRadius="0.25rem"
                                                    step={1}
                                                    value={studentScores[student._id]}
                                                    onValueChange={(e) => setStudentScores(prevScores => ({
                                                        ...prevScores,
                                                        [student._id]: e.value
                                                    }))}
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
                    flex="1"
                    marginBottom="2rem">
                    <Box onClick={handleBack} p="0.5rem" cursor="pointer">
                        <FaArrowLeft size="1.5rem" className='FaArrowLeft' />
                    </Box>

                    <Box>
                        <Button
                            borderRadius={"4rem"}
                            w="12rem"
                            borderWidth="2px"
                            borderColor={"green.500"}
                            bg="none"
                            color="green.500"
                            fontSize={{ sm: "lg", lg: "xl" }}
                            transition="all 0.3s"
                            onClick={handleDeleteButton}
                            _hover={{ transform: "translateY(-3px)" }}
                        >Delete Homework</Button>

                        <Button
                            borderRadius={"4rem"}
                            w="6rem"
                            bg="green.500"
                            color="gray.100"
                            fontSize={{ sm: "lg", lg: "xl" }}
                            transition="all 0.3s"
                            _hover={{ transform: "translateY(-3px)" }}
                            marginLeft="1.5rem"
                            onClick={handleSaveButton}
                        >Save</Button>
                    </Box>



                </HStack>

            </VStack>

        </Box>
    )
}

export default Homework