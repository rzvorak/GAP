import React, { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text, HStack, Center, useBreakpointValue, Spinner } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate, useLocation } from 'react-router-dom'

import { FaArrowLeft } from 'react-icons/fa';
import { GoPencil } from "react-icons/go";

import Dialog_Profile from '../components/Dialog_Profile';

import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from '../components/ui/accordion'

import { useStudentStore } from '../store/student.js';

import { Toaster, toaster } from "../components/ui/toaster"


const Student_Profile = () => {

    const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })

    const role = localStorage.getItem("role")

    const location = useLocation();
    const studentId = location.state?.studentId;

    const [currentStudent, setCurrentStudent] = useState({});
    const { updateStudent, fetchStudents, students } = useStudentStore();

    useEffect(() => {
        fetchStudents()
    }, [fetchStudents]);

    useEffect(() => {
        if (!studentId || students.length === 0) return;

        console.log("Processing students and homeworks...");

        const student = students.find(student => student._id === studentId);
        setCurrentStudent(student);
    }, [students]);


    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/students/student-view', { state: { studentId: studentId } })
    }

    const [dialog, setDialog] = useState(false);
    const [editCategory, setEditCategory] = useState("")
    const handleEdit = (category) => {
        setEditCategory(category)
        setDialog(!dialog);
    }

    const handleSubmit = async (updatedProfile) => {
        const { success } = await updateStudent(studentId, {
            ...currentStudent,
            profile: updatedProfile
        })
        toaster.create({
            title: success ? "Information saved successfully" : "Error saving information",
            type: success ? "success" : "error",
            duration: "2000"
        })
    }

    // TODO: potentially make global, ensure can't have duplicate
    const categories = {
        "Pupil's Information": ["First Name", "Middle Name", "Surname", "Date of Birth", "Place of Birth", "Birth Certificate Number", "Sex", "Nationality", "Region"],
        "Parent's / Guardian's Information": ["Father's Full Name", "Father's Occupation", "Father's Place of Work", "Father's Physical Address", "Father's Street", "Father's House Number", "Father's Telephone", "Father's Mobile", "Mother's Full Name", "Mother's Occupation", "Mother's Place of Work", "Mother's Physical Address", "Mother's Street", "Mother's House Number", "Mother's Telephone", "Mother's Mobile",],
        "Pupil's Medical Information": ["Doctor's Full Name", "Hospital", "Hospital Location", "Mobile", "Health Concerns", "Regular Medication (if any)"],
        "Emergency Contact and Safety": ["Emergency Contact Name", "Emergency Contact Relation", "Emergency Contact Mobile", "Allowed to pick up child", "Not allowed to pick up child"],
        "Confirmation": ["Pupil is registed in", "Headmaster Full Name", "Signature", "Date"]
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

            {dialog && <Dialog_Profile categories={categories} editCategory={editCategory} currentProfile={currentStudent.profile} handleSubmit={handleSubmit} setDialog={setDialog}></Dialog_Profile>}
            {!dialog && <Header></Header>}
            {!dialog && currentStudent.profile && currentStudent.name ? (

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
                        paddingTop="1rem"
                        paddingBottom="1rem"
                        minHeight="4rem"
                        display={disappearOnMin}
                        flexWrap="wrap"
                        alignItems={"flex-start"}
                        overflow="visible"
                    >
                        <HStack
                            marginRight="10%"
                            w="90%"
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
                                <Text ml="1rem">{currentStudent.name}'s Information</Text>
                            </Box>
                        </HStack>
                    </Box>


                    <VStack w="100%" flex="1">
                        <AccordionRoot
                            w="80%"
                            variant={"plain"}
                            collapsible
                            multiple
                            borderRadius="0"
                        >
                            {Object.keys(categories).map((category, index) => (

                                <AccordionItem
                                    key={index}
                                    borderRadius="0"
                                    bg="gray.200"
                                    marginBottom="1rem"
                                    value={category}
                                >
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
                                        >{category}</Text>
                                    </AccordionItemTrigger>
                                    <AccordionItemContent

                                        bg="gray.200"
                                        p="0.5rem"
                                    >
                                        <Box display="flex" flexDir="column" position="relative" >
                                            <Box>
                                                {categories[category].map((field) => (
                                                    <VStack key={field} alignItems={"flex-start"} gap="0rem">
                                                        <Text lineClamp="1" fontWeight="bold" fontSize="sm" p="0.4rem">{field}:</Text>
                                                        <Text lineClamp="1" fontSize="sm" p="0.4rem">{currentStudent.profile[field]}</Text>
                                                    </VStack>
                                                ))}
                                            </Box>

                                            {role !== "student" ? (
                                                <Box
                                                    position={{ "xxs": "relative", sm: "absolute" }}
                                                    bottom={{ "xxs": "0rem", sm: "0.7rem" }}
                                                    right={{ "xxs": "0rem", sm: "1.5rem" }}
                                                    w="3rem"
                                                    h="3rem"
                                                    cursor="pointer"
                                                    color="green.500"
                                                    onClick={() => handleEdit(category)}
                                                    transition="all 0.2s ease-in-out"
                                                    _hover={{ transform: "translateY(-3px)" }}
                                                >
                                                    <Center h="100%"><GoPencil size="2rem" /></Center>

                                                </Box>
                                            ) : (null)}

                                        </Box>
                                    </AccordionItemContent>
                                </AccordionItem>
                            ))}
                        </AccordionRoot>
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

                </VStack>) : (

                !dialog &&
                <Box w="100%" display="flex" justifyContent="center" pt="17rem">
                    <Spinner marginTop="2rem" color="green.500" borderWidth="4px" cosize="xl" />
                </Box>

            )}
        </Box >
    )
}

export default Student_Profile