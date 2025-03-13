import React, { useEffect, useState } from 'react'
import { Box, VStack, Heading, Text, HStack, Center, Spinner, useBreakpointValue, SimpleGrid } from '@chakra-ui/react'
import Header from '../components/Header'
import { useLocation, useNavigate } from 'react-router-dom'

import { useStudentStore } from '../store/student.js'
import { useHomeworkStore } from '../store/homework.js'
import { useExamStore } from '../store/exam.js'

import { FaRegUser } from "react-icons/fa6";
import { GoPencil } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { SlGraph } from "react-icons/sl";

import Dialog_Delete from '../components/Dialog_Delete.jsx'

const Student = () => {

    const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })

    const location = useLocation();
    const studentId = location.state?.studentId;

    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/students')
    }

    const { fetchHomeworks, homeworks } = useHomeworkStore()
    const { fetchExams, exams } = useExamStore()
    const { fetchStudents, updateStudent, deleteStudent, students } = useStudentStore()

    const [localStudents, setLocalStudents] = useState([])
    const [allStudents, setAllStudents] = useState([])

    const [settings, setSettings] = useState({})

    const [currentStudent, setCurrentStudent] = useState({})

    const [triggerLoad, setTriggerLoad] = useState(false)
    const [triggerSave, setTriggerSave] = useState(false)

    // launch once on load, get students, homeworks, and settings
    useEffect(() => {
        async function fetchAll() {
            console.log("Fetching...")
            const res = await fetch("/api/settings");
            const data = await res.json();
            setSettings(data.data);

            await fetchStudents();
            await fetchHomeworks();
            await fetchExams();
            setTriggerLoad(true);
        }

        fetchAll();
    }, []);

    // wait for students, homework, exams, and settings then execute
    useEffect(() => {
        // TODO: see how this interacts when all students and homeworks are cleared from database
        if (!studentId || !settings.cutoffs || homeworks.length === 0 || students.length === 0 || exams.length === 0) return;

        console.log("Processing....")

        const student = students.find(student => student._id === studentId);
        setCurrentStudent(student);

        //setTriggerSave(true);

    }, [triggerLoad]);

    // trigger save to properly load everything
    useEffect(() => {
        if (!triggerSave) return;
        handleSaveButton()
    }, [triggerSave]);

    const boxes = ["See Scores", "Create Report", "Student Profile", "Add Comments"]
    const iconSize = useBreakpointValue({ "xxs": "3rem", "xs": "4rem", sm: "5rem", md: "7rem", lg: "9rem" });


    if (!currentStudent.name) {
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

            <Box
                w="100%"
                paddingTop="1rem"
                paddingBottom="1rem"
                minHeight="4rem"
                display={disappearOnMin}
                flexDirection={"column"}
                flexWrap="wrap"
                alignItems={"flex-start"}
                overflow="visible">
                <Heading
                    marginLeft="1rem"
                    marginRight="1rem"
                    color="gray.600"
                    fontSize="2xl"
                    fontWeight={"400"}
                    whiteSpace={"normal"}
                    wordBreak="break-word"

                >{currentStudent.name}</Heading>
            </Box>


            <VStack gap="0" display={disappearOnMin} flex="1" w="100%">

                <Box
                    w="80%"
                    maxW="40rem"
                >
                    <Box
                        borderRadius="1.2rem"
                        paddingLeft="1rem"
                        display="flex"
                        flexDir="column"
                        bg="gray.200">
                        <Text lineClamp="1" marginRight="1rem" marginTop="1rem">Class: {currentStudent.class}</Text>
                        <Text lineClamp="1" marginRight="1rem" marginTop="1rem">test</Text>
                        <Text lineClamp="1" marginRight="1rem" marginTop="1rem">test</Text>
                    </Box>


                    <SimpleGrid
                        display={disappearOnMin}
                        columns={useBreakpointValue({ "xxs": 1, sm: 2 })}
                        w={"full"}
                        marginTop={"2rem"}
                    >

                        {boxes.map((box, index) => (
                            <Center key={index}>
                                <Box
                                    h={{ "xxs": "8rem", "xs": "10rem", sm: "14rem", md: "16rem", lg: "17rem", xl: "17rem" }}
                                    w={{ "xxs": "12rem", "xs": "18rem", sm: "14rem", md: "23rem", lg: "29rem", xl: "38rem" }}
                                    bg="gray.100"
                                    marginBottom="2rem"
                                    borderRadius={"1.25rem"}
                                    display="flex"
                                    flexDirection={"column"}
                                    style={{ boxShadow: 'var(--box-shadow-classic)' }}
                                    //onClick={}
                                    transition="all 0.3s"
                                    _hover={{ cursor: 'pointer', transform: "translateY(-5px)" }}
                                >
                                    <VStack h="100%" >
                                        <Heading
                                            color="gray.600"
                                            fontWeight="400"
                                            marginTop={{ "xxs": "0.75rem", "xs": "1rem", sm: "1.5rem", md: "2rem", lg: "2rem" }}
                                            marginBottom={{ "xxs": "0.5rem", "xs": "1rem", sm: "1.5rem", md: "1.5rem", lg: "2rem" }}
                                            fontSize={{ sm: "lg", md: "2xl", lg: "3xl" }}
                                        >{box}</Heading>
                                        <Box color="green.500">
                                            {box === "Student Profile" ? <FaRegUser size={iconSize} /> : null}
                                            {box === "Add Comments" ? <GoPencil size={iconSize} /> : null}
                                            {box === "Create Report" ? <IoDocumentTextOutline size={iconSize} /> : null}
                                            {box === "See Scores" ? <SlGraph size={iconSize} /> : null}
                                        </Box>
                                    </VStack>
                                </Box>
                            </Center>
                        ))}
                    </SimpleGrid>


                </Box>

            </VStack>
        </Box>
    )
}

export default Student