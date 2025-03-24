import React, { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text, Center, useBreakpointValue, Spinner } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate, useLocation } from 'react-router-dom'

import { FaArrowLeft } from 'react-icons/fa';
import { GoPencil } from "react-icons/go";

import AddButton from '../components/AddButton'
import Dialog_Exam from '../components/Dialog_Exam'

import { useExamStore } from '../store/exam.js'

import { Toaster, toaster } from "../components/ui/toaster"

import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from '../components/ui/accordion'

const Scores_Exam = () => {

    const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })

    const location = useLocation();
    const selectedClass = location.state?.selectedClass;
    const selectedType = location.state?.selectedType;
    const capitalizedType = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);

    const { fetchExams, createExam, exams } = useExamStore();
    const [localExams, setLocalExams] = useState([])
    const [isExamLoading, setIsExamLoading] = useState(true)
    const [subjects, setSubjects] = useState({})

    useEffect(() => {
        const fetchSettings = async () => {
            const res = await fetch('/api/settings');
            const data = await res.json();

            setSubjects(data.data.subjects)
        }

        fetchExams().then(() => fetchSettings()).then(() => setIsExamLoading(false))
    }, [fetchExams]);

    useEffect(() => {
        setLocalExams(exams.filter(exam => { return (exam.class == Number(selectedClass.slice(-1)) && exam.type === selectedType) }));
    }, [exams]);

    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/scores/type', { state: { selectedClass: selectedClass } })
    }

    const handleForward = (examId) => {
        navigate('/scores/exam-view', { state: { examId: examId, selectedClass: selectedClass, selectedType: selectedType } })
    }

    const [dialog, setDialog] = useState(false);
    const handleAdd = () => {
        setDialog(!dialog);
    }

    const handleSubmitExam = async (examPoints, examMonth, examMeanGrade) => {
        const { success, message } = await createExam({
            type: selectedType,
            points: examPoints,
            month: examMonth,
            // account here for the fact that class was a string "Class X"
            class: Number(selectedClass.slice(-1)),
            meanGrade: examMeanGrade
        });
        toaster.create({
            title: success ? "Exam created successfully" : "Error creating exam",
            type: success ? "success" : "error",
            duration: "2000"
        })
        fetchExams();
    }

    return (
        <Box
            minH={"100vh"}
            maxW={"100vw"}
            bg={"gray.100"}
            color="gray.900"
            display="flex"
            flexDir="column"
        >

            <Toaster />
            {dialog && <Dialog_Exam handleSubmitExam={handleSubmitExam} setDialog={setDialog} selectedType={selectedType} capitalizedType={capitalizedType} selectedClass={selectedClass}></Dialog_Exam>}

            <Header></Header>

            <VStack
                w="100%"
                paddingBottom="0rem"
                display={disappearOnMin}
                gap="0"
                flexDir="column"
                flex="1"
            >
                <Box
                    w="100%"
                    h="4rem"
                    display="flex"
                    alignItems="center"
                    marginBottom="1rem"
                >
                    <Heading
                        marginLeft="1rem"
                        color="gray.600"
                        fontSize="2xl"
                        fontWeight={"400"}
                    >{capitalizedType} Exams:</Heading>
                </Box>


                <VStack w="100%" flex="1">

                    {!isExamLoading ? (
                        <AccordionRoot
                            w="80%"
                            variant={"plain"}
                            collapsible
                            multiple
                            borderRadius="0"
                        >
                            {localExams.map((exam, index) => (
                                <AccordionItem
                                    borderRadius="0"
                                    bg="gray.200"
                                    marginBottom="1rem"
                                    key={index}
                                    value={exam.createdAt}>
                                    <AccordionItemTrigger
                                        p="0.75rem"
                                        cursor="pointer"
                                        h="3.5rem"
                                        bg="gray.100"
                                        fontWeight="400"
                                        display="flex"
                                        style={{ boxShadow: 'var(--box-shadow-classic)' }}
                                    >
                                        <Text
                                            position="absolute"
                                            lineClamp="1"
                                            maxWidth={{ "xxs": "30%", "xs": "40%", sm: "50%" }}
                                        >{exam.type.charAt(0).toUpperCase()}{exam.type.slice(1)} Exam</Text>
                                        <Box
                                            position="absolute"
                                            right="20%"
                                            fontSize="sm"
                                            bg="gray.200"
                                            p="0.5rem"
                                            borderRadius="0.7rem"
                                            marginRight="1rem"
                                        >{exam.month}</Box>

                                    </AccordionItemTrigger>
                                    <AccordionItemContent
                                        h={{ sm: "7.5rem" }}
                                        bg="gray.200"
                                        p="0.5rem"
                                    >
                                        <Box display="flex" flexDir="column" position="relative" >
                                            <Box>
                                                <Text lineClamp="1" fontSize="sm" p="0.4rem">Points:  {exam.points} </Text>
                                                <Text lineClamp="1" fontSize="sm" p="0.4rem">Class Mean Grade:  {exam.meanGrade == -1 || exam.meanGrade == null ? "Not yet scored" : (((exam.meanGrade / (subjects[exam.class].length * exam.points)) * 100).toFixed(1) + "%")}</Text>
                                                <Text lineClamp="1" fontSize="sm" p="0.4rem">Date Created: {String(exam.createdAt).slice(0, 10)}</Text>
                                            </Box>

                                            <Box
                                                position={{ "xxs": "relative", sm: "absolute" }}
                                                bottom="0rem"
                                                right={{ "xxs": "0rem", sm: "1.5rem" }}
                                                w="3rem"
                                                h="3rem"
                                                cursor="pointer"
                                                color="green.500"
                                                onClick={() => handleForward(exam._id)}
                                                transition="all 0.2s ease-in-out"
                                                _hover={{ transform: "translateY(-3px)" }}
                                            >
                                                <Center h="100%"><GoPencil size="2rem" /></Center>

                                            </Box>
                                        </Box>

                                    </AccordionItemContent>
                                </AccordionItem>
                            ))}
                        </AccordionRoot>

                    ) :
                        <Box marginBottom="2rem">
                            <Spinner color="green.500" borderWidth="4px" cosize="xl" />
                        </Box>
                    }



                    <Box onClick={handleAdd}><AddButton></AddButton></Box>

                </VStack>

                <Box
                    w="100%"
                    display="flex"
                    h="8rem"
                    paddingTop="2rem" // control how close plus can get
                    paddingBottom="2rem"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Box
                        w={{ "xxs": "12rem", "xs": "14rem", sm: "15rem" }}
                        h="3rem"
                        display="flex"
                        alignItems="center"
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
                            <Text marginRight={"0.5rem"}>{capitalizedType}: {selectedClass}</Text>
                            <GoPencil size="1rem" />
                        </Box>
                    </Box>
                </Box>

            </VStack>

        </Box >
    )
}

export default Scores_Exam