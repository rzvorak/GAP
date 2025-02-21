import React, { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text, } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate, useLocation } from 'react-router-dom'

import { FaArrowLeft } from 'react-icons/fa';
import { GoPencil } from "react-icons/go";

import AddButton from '../components/AddButton'
import Dialog_Homework from '../components/Dialog_Homework'

import { useHomeworkStore } from '../store/homework.js'

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
            class: homeworkClass,
            meanGrade: homeworkMeanGrade
        });
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
                    >Homework:</Heading>
                </Box>

                <Box onClick={handleAdd}><AddButton></AddButton></Box>

                <Box
                    position="absolute"
                    bottom="4rem"
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

            </VStack>
        </Box>
    )
}

export default Scores_Homework