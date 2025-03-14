import Header from '../components/Header'
import ClassButton from '../components/ClassButton'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'
import { Box, VStack, Heading, HStack, Input, Button, Text, Center, useBreakpointValue, SimpleGrid, Spinner, Link } from '@chakra-ui/react'
import { IoClose } from "react-icons/io5";
import { FaArrowLeft } from 'react-icons/fa';


import { useStudentStore } from '../store/student.js';
import Dialog_Student from '../components/Dialog_Student.jsx'
import Dialog_Delete from '../components/Dialog_Delete.jsx'


const Students = () => {

    const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })

    const { fetchStudents, createStudent, deleteStudent, students } = useStudentStore();
    // forces react to re-rended properly when a new student is added
    const [localStudents, setLocalStudents] = useState([])
    const [allStudents, setAllStudents] = useState([])
    const [isStudentsLoading, setIsStudentsLoading] = useState(true)

    // track which class are currently selected for filter
    const [selectedClasses, setSelectedClasses] = useState({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
    })

    const handleClassSelect = (classId) => {
        setSelectedClasses(prevState => ({
            ...prevState,
            [classId]: !selectedClasses[classId]
        }))
    }

    // runs once on initial render, re-calls every time a dependency (in array) changes
    useEffect(() => {
        fetchStudents().then(() => setIsStudentsLoading(false));
    }, [fetchStudents]);

    // runs every time students are updated
    useEffect(() => {
        setLocalStudents(students);
        setAllStudents(students);
    }, [students]);


    const [dialogStudent, setDialogStudent] = useState(false);
    const handleAddStudent = () => {
        fetchStudents();
        setDialogStudent(!dialogStudent);
    }

    // logic for filtering students during search
    const [search, setSearch] = useState("")
    const handleGetStudents = async () => {
        if (Object.values(selectedClasses).some(selected => selected) && search !== "") {
            setLocalStudents(allStudents)
            setLocalStudents(allStudents.filter((student) => { return selectedClasses[student.class] && student.name.toLowerCase().includes(search.toLowerCase()) }))
        } else if (Object.values(selectedClasses).some(selected => selected) && search === "") {
            setLocalStudents(allStudents)
            setLocalStudents(allStudents.filter((student) => { return selectedClasses[student.class] }))
        } else if (!Object.values(selectedClasses).some(selected => selected) && search !== "") {
            setLocalStudents(allStudents)
            setLocalStudents(allStudents.filter((student) => { return student.name.toLowerCase().includes(search.toLowerCase()) }))
        } else {
            setLocalStudents(allStudents)
        }
    }

    const handleSubmitStudent = async (studentName, studentClass) => {
        console.log('function called in students (name class):', studentName, studentClass)
        const { success, message } = await createStudent({
            name: studentName,
            class: studentClass,
            homeworkLog: {},
            examLog: {},
            comments: {},
            profile: {"First Name": "Testing..."},
        });
        fetchStudents();
        console.log(success, message);
    }

    const [dialogDelete, setDialogDelete] = useState(false)
    const [deleteStudentId, setDeleteStudentId] = useState("")
    const handleDeleteButton = (studentId) => {
        setDeleteStudentId(studentId);
        setDialogDelete(!dialogDelete);
    }

    const navigate = useNavigate();

    // to conform with Dialog_Delete
    const handleDeleteBack = () => {
        console.log("Student successfully deleted")
    }

    const handleForward = (studentId) => {
        navigate('/students/student-view', { state: { studentId: studentId } })
    }

    const handleBack = () => {
        navigate('/landing')
    }

    return (
        <Box
            minH={"100vh"}
            maxW={"100vw"}
            bg={"gray.100"}
            color="gray.900"
            display="flex"
            flexDir={"column"}
        >
            {dialogDelete && <Dialog_Delete handleBack={handleDeleteBack} delete={deleteStudent} id={deleteStudentId} setDialog={setDialogDelete}></Dialog_Delete>}
            {dialogStudent && <Dialog_Student handleSubmitStudent={handleSubmitStudent} setDialog={setDialogStudent}></Dialog_Student>}

            <Header></Header>

            <VStack
                w="100%"
                h="100%"
                display={disappearOnMin}
                flexDir={"column"}
                flex="1"
            >

                <Box
                    w="100%"
                    h={{ "xxs": "4rem", "xs": "4rem", sm: "4rem" }}
                    display="flex"
                    alignItems="center"
                >
                    <Heading
                        marginLeft="1rem"
                        color="gray.600"
                        fontSize="2xl"
                        fontWeight={"400"}
                    >Student Database</Heading>
                </Box>

                <Box
                    w="100%"
                    h={{ "xxs": "7rem", "xs": "7rem", sm: "4rem" }}
                    display="flex"
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <HStack
                        alignItems={"center"}
                    >
                        <Heading
                            marginRight="0.5rem"
                            marginBottom="0.3rem"
                            color="gray.600"
                            fontWeight={"400"}
                            fontSize={{ "xxs": "lg", sm: "xl" }}
                        >Class: </Heading>

                        <SimpleGrid
                            columns={useBreakpointValue({ "xxs": 4, "xs": 4, sm: 7 })}>
                            {["1", "2", "3", "4", "5", "6", "7"].map((classNum, index) => (
                                <ClassButton key={index} handleClassSelect={handleClassSelect} class={classNum}></ClassButton>
                            ))}
                        </SimpleGrid>


                    </HStack>
                </Box>

                <Box
                    w="100%"
                    h={{ "xxs": "4rem" }}
                    display="flex"
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <HStack
                        alignItems={"center"}
                    >
                        <Heading
                            marginRight="0.5rem"
                            marginBottom="0.3rem"
                            color="gray.600"
                            fontWeight={"400"}
                            fontSize={{ "xxs": "lg", sm: "xl" }}
                        >Search: </Heading>

                        <Input
                            placeholder="Student Name (Optional)"
                            style={{ boxShadow: 'var(--box-shadow-classic)' }}
                            border="none"
                            borderRadius="0.5rem"
                            marginBottom="0.3rem"
                            transition='all 0.3s'
                            w={{ "xxs": "10rem", "xs": "15rem", sm: "22rem" }}
                            _hover={{ transform: "translateY(-3px)" }}
                            value={search}
                            onChange={(e) => { setSearch(e.target.value) }}
                        ></Input>
                    </HStack>
                </Box>

                <Box
                    w="100%"
                    h={{ "xxs": "4rem" }}
                    display="flex"
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <HStack
                        alignItems={"center"}
                    >

                        <Button
                            borderRadius={"4rem"}
                            w={{ "xxs": "6rem", "xs": "9rem", sm: "12rem" }}
                            bg="green.500"
                            color="gray.100"
                            fontSize={{ "xxs": "xs", "xs": "base", sm: "lg", lg: "xl" }}
                            transition="all 0.3s"
                            _hover={{ transform: "translateY(-3px)" }}
                            marginRight={{ "xxs": "0.7rem", "xs": "1rem", sm: "1.5rem" }}
                            onClick={handleGetStudents}
                        >Get Students</Button>

                        <Button
                            borderRadius={"4rem"}
                            w={{ "xxs": "6rem", "xs": "9rem", sm: "12rem" }}
                            borderWidth="2px"
                            borderColor={"green.500"}
                            bg="none"
                            color="green.500"
                            fontSize={{ "xxs": "xs", "xs": "base", sm: "lg", lg: "xl" }}
                            transition="all 0.3s"
                            onClick={handleAddStudent}
                            _hover={{ transform: "translateY(-3px)" }}
                        >Add a Student</Button>

                    </HStack>
                </Box>

                <VStack
                    w="100%"
                    flex="1"
                    gap="0rem"
                    display="flex"
                    paddingBottom="0rem"
                >
                    <HStack
                        minH="4rem"
                        gap="0"
                        w="80%"
                        maxW="40rem"
                    >
                        <Box flex="4">
                            <Text ml="1rem" maxW="10rem">Name</Text>
                        </Box>
                        <Center flex="1">
                            <Text paddingRight={{ "xxs": "0.4rem", sm: "0rem" }} >Class</Text>
                        </Center>
                        <Center flex="1">
                            <Text paddingLeft={{ "xxs": "0.4rem", sm: "0rem" }} >Grade</Text>
                        </Center>
                        <Center flex="1">
                            <Text></Text>
                        </Center>
                    </HStack>

                    <VStack
                        w="80%"
                        maxW="40rem"
                        gap="0rem"
                        alignItems={"center"} >

                        {isStudentsLoading ? (
                            <Spinner marginTop="2rem" color="gray.400" borderWidth="4px" cosize="xl" />
                        ) : (
                            localStudents.length !== 0 && localStudents.sort((a, b) => a.class - b.class) ?

                                localStudents.map((student, index) => (
                                    <Box
                                        w="100%"
                                        h="3rem"
                                        bg={index % 2 === 0 ? "gray.200" : "gray.300"}
                                        display="flex"
                                        alignItems="center"
                                        key={index}>
                                        <HStack
                                            display="flex"
                                            w="100%"
                                            gap="0">
                                            <Box flex="4" >
                                                <Link
                                                    py="0.5rem"
                                                    pr="0.5rem"
                                                    color="gray.900"
                                                    ml="1rem"
                                                    //bg="transparent"
                                                    transition="all 0.1s ease-in-out"
                                                    textDecoration={"none"}
                                                    _hover={{ color: "gray.400" }}
                                                    onClick={() => handleForward(student._id)}
                                                >
                                                    <Text

                                                        maxW={{ "xxs": "5rem", "xs": "8rem", sm: "12rem", md: "20rem" }}
                                                        truncate
                                                    >{student.name}</Text>
                                                </Link>
                                            </Box>
                                            <Center flex="1">
                                                <Text>{student.class}</Text>
                                            </Center>
                                            <Center flex="1">
                                                <Text>A</Text>
                                            </Center>
                                            <Center flex="1">
                                                <Box onClick={() => handleDeleteButton(student._id)}>
                                                    <IoClose size="2rem" className="IoClose" />

                                                </Box>
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
                        )}

                    </VStack>
                </VStack>
            </VStack>

            <Box
                w="100%"
                display={disappearOnMin}
                h="8rem"
                paddingTop="2rem" // control how close plus can get
                paddingBottom="2rem"
                justifyContent="center"
                alignItems="center"
            >
                <Box
                    cursor={"pointer"}
                    onClick={handleBack}>
                    <FaArrowLeft size="1.5rem" className='FaArrowLeft' />
                </Box>
            </Box>

        </Box>
    )
}

export default Students