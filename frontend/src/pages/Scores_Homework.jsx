import React, { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text, Stack } from '@chakra-ui/react'
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
    const selectedType = location.state?.selectedType;
    const selectedClass = location.state?.selectedClass;

    const { fetchHomeworks, createHomework, homeworks } = useHomeworkStore();
    const [localHomeworks, setLocalHomeworks] = useState([])
    const [allHomeworks, setAllHomeworks] = useState([])

    useEffect(() => {
        fetchHomeworks();
    }, [fetchHomeworks]);

    useEffect(() => {
        setLocalHomeworks(homeworks);
        setAllHomeworks(homeworks);
    }, [homeworks]);

    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/scores/type', { state: { selectedClass: selectedClass } })
    }

    const handleForward = () => {

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
        fetchHomeworks();
    }

    const items = [
        { value: "a", title: "First Item", text: "Some value 1..." },
        { value: "b", title: "Second Item", text: "Some value 2..." },
        { value: "c", title: "Third Item", text: "Some value 3..." },
    ]

    return (
        <Box
            minH={"100vh"}
            maxW={"100vw"}
            bg={"gray.100"}
            color="gray.900"
        >
            {dialog && <Dialog_Homework handleSubmitHomework={handleSubmitHomework} setDialog={setDialog} selectedClass={selectedClass}></Dialog_Homework>}

            <Header></Header>


            <VStack // all the vertical layout could use adjustment, works fine
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
                        {items.map((item, index) => (
                            <AccordionItem
                                borderRadius="0"
                                bg="gray.200"
                                marginBottom="1rem"
                                key={index}
                                value={item.value}>
                                <AccordionItemTrigger
                                    p="0.5rem"
                                    cursor="pointer"
                                    h="3.5rem"

                                    bg="gray.100"
                                    fontWeight="400"
                                    style={{ boxShadow: 'var(--box-shadow-classic)' }}
                                >{item.title}</AccordionItemTrigger>
                                <AccordionItemContent
                                    h="8rem"
                                    bg="gray.200"
                                    p="0.5rem"
                                >{item.text}</AccordionItemContent>
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
                            <Text marginRight={"0.5rem"}>{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}: {selectedClass}</Text>
                            <GoPencil size="1rem" />
                        </Box>
                    </Box>
                </Box>

            </VStack>

        </Box>
    )
}

export default Scores_Homework