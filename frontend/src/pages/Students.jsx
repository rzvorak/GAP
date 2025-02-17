import Header from '../components/Header'
import ClassButton from '../components/ClassButton'

import React, { useEffect, useState } from 'react'
import '../styles/App.css'
import { Box, VStack, Heading, HStack, Input, Button, Text, Center } from '@chakra-ui/react'

import { useStudentStore } from '../store/student.js';
import Dialog from '../components/Dialog.jsx'


const Students = () => {

    const { fetchStudents, createStudent, students } = useStudentStore();
    // forces react to re-rended properly when a new student is added
    const [localStudents, setLocalStudents] = useState([])

    // runs once on initial render, re-calls every time a dependency (in array) changes
    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // runs every time students are updated
    useEffect(() => {
        setLocalStudents(students);
    }, [students]);


    const [dialog, setDialog] = useState(false);

    const handleAddStudent = () => {
        fetchStudents();
        setDialog(!dialog);
    }

    const [newStudent, setNewStudent] = useState({
        name: "",
        id: "",
        class: "",
    })

    const handleSubmitStudent = async (studentName, studentClass) => {
        console.log('function called in students')
        setNewStudent({
            name: studentName,
            id: "-1",
            class: studentClass,
        })
        console.log('student created: ', newStudent.name, newStudent.id, newStudent.class)
        const {success, message} = await createStudent(newStudent);
        fetchStudents();
        console.log(success, message);
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
                {dialog && <Dialog handleSubmitStudent={handleSubmitStudent} setDialog={setDialog}></Dialog>}

                <Header></Header>

                <VStack
                    w="100%"
                    h="100%"
                    display="flex"
                    flexDir={"column"}
                    flex="1">
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
                        >Student Database</Heading>
                    </Box>

                    <Box
                        w="100%"
                        h={{ sm: "4rem" }}
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
                                fontSize="xl"
                            >Class: </Heading>

                            <ClassButton class="1"></ClassButton>
                            <ClassButton class="2"></ClassButton>
                            <ClassButton class="3"></ClassButton>
                            <ClassButton class="4"></ClassButton>
                            <ClassButton class="5"></ClassButton>
                            <ClassButton class="6"></ClassButton>
                            <ClassButton class="7"></ClassButton>

                        </HStack>
                    </Box>

                    <Box
                        w="100%"
                        h={{ sm: "4rem" }}
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
                                fontSize="xl"
                            >Search: </Heading>

                            <Input
                                placeholder="Student Name (Optional)"
                                style={{ boxShadow: 'var(--box-shadow-classic)' }}
                                border="none"
                                borderRadius="0.5rem"
                                marginBottom="0.3rem"
                                transition='all 0.3s'
                                w="22rem"
                                _hover={{ transform: "translateY(-3px)" }}
                            ></Input>
                        </HStack>
                    </Box>

                    <Box
                        w="100%"
                        h={{ sm: "4rem" }}
                        display="flex"
                        alignItems={"center"}
                        justifyContent={"center"}
                    >
                        <HStack
                            alignItems={"center"}
                        >

                            <Button
                                borderRadius={"4rem"}
                                w="12rem"
                                bg="green.500"
                                color="gray.100"
                                fontSize={{ sm: "lg", lg: "xl" }}
                                transition="all 0.3s"
                                _hover={{ transform: "translateY(-3px)" }}
                                marginRight="1.5rem"
                            >Get Students</Button>

                                <Button
                                    borderRadius={"4rem"}
                                    w="12rem"
                                    borderWidth="2px"
                                    borderColor={"green.500"}
                                    bg="none"
                                    color="green.500"
                                    fontSize={{ sm: "lg", lg: "xl" }}
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
                        paddingBottom="2rem"
                    >
                        <HStack
                            flex="1"
                            minH="4rem"
                            gap="0"
                            w="80%"
                            maxW="40rem"
                        >
                            <Box flex="4">
                                <Text ml="1rem" maxW="10rem">Name</Text>
                            </Box>
                            <Center flex="1">
                                <Text  >Class</Text>
                            </Center>
                            <Center flex="1">
                                <Text >Grade</Text>
                            </Center>
                            <Center flex="1">
                                <Text></Text>
                            </Center>
                        </HStack>

                        <VStack
                            flex="10"
                            bg="gray.100"
                            w="80%"
                            maxW="40rem"
                            minH="12rem"
                            gap="0rem"
                            alignItems={"center"} >

                            {localStudents.map((student, index) => (
                                <Box
                                    w="100%"
                                    h="3rem"
                                    bg={index % 2 === 0 ? "gray.200" : "gray.300"}
                                    display="flex"
                                    alignItems="center">
                                    <HStack
                                        display="flex"
                                        w="100%"
                                        gap="0">
                                        <Box flex="4">
                                            <Text
                                                ml="1rem"
                                                maxW={{ sm: "12rem", md: "20rem" }}
                                                truncate>{student.name}</Text>
                                        </Box>
                                        <Center flex="1">
                                            <Text>{student.class}</Text>
                                        </Center>
                                        <Center flex="1">
                                            <Text>A</Text>
                                        </Center>
                                        <Center flex="1">
                                            <Text>View</Text>
                                        </Center>
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>
                    </VStack>
                </VStack>

            </Box>
    )
}

export default Students