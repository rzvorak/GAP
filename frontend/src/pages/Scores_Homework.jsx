import React, { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text, HStack, Center } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate, useLocation } from 'react-router-dom'

import { FaArrowLeft } from 'react-icons/fa';
import { GoPencil } from "react-icons/go";

import AddButton from '../components/AddButton'
import Dialog_Homework from '../components/Dialog_Homework'

import { useHomeworkStore } from '../store/homework.js'

import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from '../components/ui/accordion'

const Scores_Homework = () => {
    const location = useLocation();
    const selectedClass = location.state?.selectedClass;

    const { fetchHomeworks, createHomework, homeworks } = useHomeworkStore();
    const [localHomeworks, setLocalHomeworks] = useState([])

    useEffect(() => {
        fetchHomeworks();
    }, [fetchHomeworks]);

    useEffect(() => {
        setLocalHomeworks(homeworks.filter(homework => { return homework.class == Number(selectedClass.slice(-1)) }));
    }, [homeworks]);

    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/scores/type', { state: { selectedClass: selectedClass } })
    }

    const handleForward = (homeworkId) => {
        navigate('/scores/homework-view', { state: { homeworkId: homeworkId, selectedClass: selectedClass}})
    }

    const [dialog, setDialog] = useState(false);
    const handleAdd = () => {
        setDialog(!dialog);
    }

    const handleSubmitHomework = async (homeworkName, homeworkPoints, homeworkSubject, homeworkClass, homeworkMeanGrade) => {
        const { success, message } = await createHomework({
            name: homeworkName,
            points: homeworkPoints,
            subject: homeworkSubject,
            // account here for the fact that class was a string "Class X"
            class: Number(homeworkClass.slice(-1)),
            meanGrade: homeworkMeanGrade
        });
        console.log(success, message)
        fetchHomeworks();
    }

    return (
        <Box
            minH={"100vh"}
            maxW={"100vw"}
            bg={"gray.100"}
            color="gray.900"
        >
            {dialog && <Dialog_Homework handleSubmitHomework={handleSubmitHomework} setDialog={setDialog} selectedClass={selectedClass}></Dialog_Homework>}

            <Header></Header>


            <VStack // all the vertical layout could use adjustment, works fine -> use flex = 1 and flex, column in the very outer box
                w="100%"
                paddingBottom="4rem"

                display="flex"
                gap="0"
            >

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
                    >Homework:</Heading>
                </Box>


                <VStack w="100%" minH="26rem">

                    <AccordionRoot

                        w="80%"
                        variant={"plain"}
                        collapsible
                        multiple
                        borderRadius="0"
                    >


                        {localHomeworks.map((homework, index) => (
                            <AccordionItem
                                borderRadius="0"
                                bg="gray.200"
                                marginBottom="1rem"
                                key={index}
                                value={homework.name}>
                                <AccordionItemTrigger
                                    p="0.75rem"
                                    cursor="pointer"
                                    h="3.5rem"
                                    bg="gray.100"
                                    fontWeight="400"
                                    display="flex"
                                    style={{ boxShadow: 'var(--box-shadow-classic)' }}
                                >
                                    <HStack justifyContent="space-between" h="1.5rem" w="100%">
                                        {homework.name}
                                        <Box fontSize="sm" bg="gray.200" p="0.5rem" borderRadius="0.7rem" marginRight="1rem">{homework.subject.slice(0, 2)}</Box>
                                    </HStack>
                                </AccordionItemTrigger>
                                <AccordionItemContent
                                    h="9.5rem"
                                    bg="gray.200"
                                    p="0.5rem"
                                >
                                    <HStack position="relative">
                                        <Box>
                                            <Text fontSize="sm" p="0.4rem">Points:  {homework.points} </Text>
                                            <Text fontSize="sm" p="0.4rem">Subject:  {homework.subject} </Text>
                                            <Text fontSize="sm" p="0.4rem">Class Mean Grade:  {homework.meanGrade == -1 ? "Not yet scored" : homework.meanGrade} </Text>
                                            <Text fontSize="sm" p="0.4rem">Date Created: {String(homework.createdAt).slice(0, 10)}</Text>
                                        </Box>

                                        <Box
                                            position="absolute"
                                            bottom="0.7rem"
                                            right="1.5rem"
                                            w="3rem"
                                            h="3rem"
                                            cursor="pointer"
                                            color="green.500"
                                            onClick={() => handleForward(homework._id)}
                                            transition="all 0.2s ease-in-out"
                                            _hover={{transform: "translateY(-3px)"}}
                                        >
                                            <Center h="100%"><GoPencil size="2rem" /></Center>
                                                
                                        </Box>
                                    </HStack>

                                </AccordionItemContent>
                            </AccordionItem>
                        ))}
                    </AccordionRoot>

                    <Box onClick={handleAdd}><AddButton></AddButton></Box>



                </VStack>

                <Box
                    w="100%"
                    display="flex"
                    paddingTop="3rem"
                    justifyContent="center">
                    <Box
                        position="relative"
                        bottom="0rem" // fix vertical compression issue, stop button from continuing up 
                        w="15rem"
                        h="3rem"
                        display="flex"
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        onClick={handleBack}
                        cursor="pointer"
                        className='backContainer'>
                        <FaArrowLeft size="1.5rem" className='FaArrowLeft' />

                        <Box
                            h="100%"
                            w="80%"
                            bg="green.500"
                            color="gray.100"
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            userSelect={"none"}
                            transition="all 0.3s"
                            _hover={{ bg: "green.600" }}
                        >
                            <Text marginRight={"0.5rem"}>Homework: {selectedClass}</Text>
                            <GoPencil size="1rem" />
                        </Box>
                    </Box>
                </Box>

            </VStack>

        </Box>
    )
}

export default Scores_Homework