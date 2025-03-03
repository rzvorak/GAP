import React, { useEffect, useState } from 'react'
import { Box, VStack, Heading, Text, HStack, Input, Center, Button, Spinner } from '@chakra-ui/react'
import Header from '../components/Header'
import { useLocation, useNavigate } from 'react-router-dom'

import { useStudentStore } from '../store/student.js'
import { useHomeworkStore } from '../store/homework.js'
import { FaArrowLeft } from 'react-icons/fa';

import Dialog_Delete from '../components/Dialog_Delete.jsx'


const Homework = () => {
    const location = useLocation();
    const homeworkId = location.state?.homeworkId;
    const selectedClass = location.state?.selectedClass;

    const navigate = useNavigate();
    const handleBack = () => {
        console.log(homeworkId)
        navigate('/scores/homework', { state: { selectedClass: selectedClass } })

    }

    const { fetchHomeworks, updateHomework, deleteHomework, homeworks } = useHomeworkStore()

    const { fetchStudents, students } = useStudentStore()

    const [localStudents, setLocalStudents] = useState([])
    const [allStudents, setAllStudents] = useState([])

    const [currentHomework, setCurrentHomework] = useState({})

    useEffect(() => {
        fetchHomeworks()
    }, [fetchHomeworks])

    useEffect(() => {
        setCurrentHomework(homeworks.filter(homework => { return homework._id === homeworkId })[0])
    })

    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

    useEffect(() => {
        setAllStudents(students.filter(student => { return student.class == Number(selectedClass.slice(-1)) }))
        setLocalStudents(students.filter(student => { return student.class == Number(selectedClass.slice(-1)) }))
    }, [students])

    const [search, setSearch] = useState("")

    useEffect(() => {
        setLocalStudents(allStudents.filter(student => { return student.name.toLowerCase().includes(search.toLowerCase()) }))

    }, [search, allStudents])

    const [dialog, setDialog] = useState(false);
    const handleDeleteButton = () => {
        setDialog(!dialog);
    }

    if (!currentHomework) {
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

            {dialog && <Dialog_Delete setDialog={setDialog}></Dialog_Delete>}

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
                    //bg="red.100"
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
                            w="100%"
                            maxW="40rem"
                            minH="12rem"
                            gap="0rem"
                            alignItems={"center"} >

                            {localStudents.length !== 0 && localStudents.sort((a, b) => a.class - b.class) ?

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
                        //onClick={handleGetStudents}
                        >Save</Button>
                    </Box>



                </HStack>

            </VStack>

        </Box>
    )
}

export default Homework