import React, { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text, HStack, Center, useBreakpointValue, Spinner } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate, useLocation } from 'react-router-dom'

import { FaArrowLeft } from 'react-icons/fa';
import { GoPencil } from "react-icons/go";
import { IoClose } from "react-icons/io5";

import Dialog_Profile from '../components/Dialog_Profile';

import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from '../components/ui/accordion'

import Dialog_Comments from '../components/Dialog_Comments'
import Dialog_Delete from '../components/Dialog_Delete';

import { useStudentStore } from '../store/student.js';


const Student_Profile = () => {

    const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })

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
        console.log(category)
        setEditCategory(category)
        setDialog(!dialog);
    }

    const handleSubmit = async (updatedProfile) => {

        console.log(updatedProfile)

        // const { success } = await updateStudent(studentId, {
        //     ...currentStudent,
        //     profile: updatedProfile
        // })
        console.log(success)
    }

    // TODO: potentially make global
    const categories = {
        "Pupil's Information": ["First Name", "Middle Name", "Surname", "Date of Birth", "Place of Birth", "Birth Certificate Number", "Sex", "Nationality", "Region"],
        "Parent's / Guardian's Information": ["Father's Full Name", "Occupation", "Place of Work", "Physical Address", "Street", "House Number", "Telephone", "Mobile", "Mother's Full Name", "Occupation", "Place of Work", "Physical Address", "Street", "House Number", "Telephone", "Mobile",],
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
            {dialog && <Dialog_Profile categories={categories} editCategory={editCategory} currentProfile={currentStudent.profile} handleSubmit={handleSubmit} setDialog={setDialog}></Dialog_Profile>}


            <Header></Header>

            {currentStudent.profile && currentStudent.name ? (

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
                        >{currentStudent.name}'s Information</Heading>
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
                                                {categories[category].map((field, findex) => (
                                                    <Text key={findex} lineClamp="1" fontSize="sm" p="0.4rem">{field}: {currentStudent.profile[field]} </Text>
                                                ))}
                                            </Box>

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
                <Box w="100%" display="flex" justifyContent="center" pt="17rem">
                    <Spinner marginTop="2rem" color="green.500" borderWidth="4px" cosize="xl" />
                </Box>
            )}
        </Box >
    )
}

export default Student_Profile