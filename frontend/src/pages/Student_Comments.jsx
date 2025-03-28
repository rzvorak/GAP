import React, { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text, HStack, Center, useBreakpointValue, Spinner } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate, useLocation } from 'react-router-dom'

import { FaArrowLeft } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";

import AddButton from '../components/AddButton'
import Dialog_Comments from '../components/Dialog_Comments'
import Dialog_Delete from '../components/Dialog_Delete';

import { useStudentStore } from '../store/student.js';

import { Toaster, toaster } from "../components/ui/toaster"



const Student_Comments = () => {

    const role = localStorage.getItem("role")

    const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })

    const location = useLocation();
    const studentId = location.state?.studentId;

    const [currentStudent, setCurrentStudent] = useState({});
    const { updateStudent, fetchStudents, students } = useStudentStore();
    const [localComments, setLocalComments] = useState({})

    useEffect(() => {
        fetchStudents()
    }, [fetchStudents]);


    useEffect(() => {
        if (!studentId || students.length === 0) return;

        console.log("Processing students and homeworks...");

        const student = students.find(student => student._id === studentId);
        setLocalComments(student.comments)
        setCurrentStudent(student);
    }, [students]);


    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/students/student-view', { state: { studentId: studentId } })
    }

    const [dialog, setDialog] = useState(false);
    const handleAdd = () => {
        setDialog(!dialog);
    }

    const handleSubmitComment = async (name, role, comment) => {

        const timestamp = Date.now();
        const updatedComments = {
            ...currentStudent.comments,
            [timestamp]: [name, role, comment]
        }

        const { success } = await updateStudent(studentId, {
            ...currentStudent,
            comments: updatedComments
        })

        toaster.create({
            title: success ? "Comment posted successfully" : "Error posting comment",
            type: success ? "success" : "error",
            duration: "2000"
        })
    }

    const [dialogDelete, setDialogDelete] = useState(false)
    const [deleteCommentId, setDeleteCommentId] = useState("")
    const handleDeleteButton = (id) => {
        setDeleteCommentId(id);
        setDialogDelete(!dialogDelete);
    }

    // to conform with Dialog_Delete
    const handleDeleteBack = () => {
        toaster.create({
            title: "Comment deleted successfully",
            type: "success",
            duration: "2000"
        })
    }

    const deleteComment = async (id) => {

        const updatedComments = { ...currentStudent.comments }
        delete updatedComments[id];

        const { success } = await updateStudent(studentId, {
            ...currentStudent,
            comments: updatedComments
        })
        console.log(success)
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
            {dialog && <Dialog_Comments handleSubmitComment={handleSubmitComment} setDialog={setDialog}></Dialog_Comments>}
            {dialogDelete && <Dialog_Delete handleBack={handleDeleteBack} delete={deleteComment} id={deleteCommentId} setDialog={setDialogDelete}></Dialog_Delete>}

            <Toaster />

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
                    <Box ml="1rem" mt="0.25rem"
                        cursor={"pointer"}
                        onClick={handleBack}>
                        <FaArrowLeft size="1.5rem" className='FaArrowLeft' />
                    </Box>
                    <Heading
                        marginLeft="1rem"
                        color="gray.600"
                        fontSize="2xl"
                        fontWeight={"400"}
                    >Comments:</Heading>
                </Box>


                <VStack w="100%" flex="1">



                    {currentStudent.comments ? (

                        Object.keys(localComments).length == 0 && role === "student" ? (
                            <Box bg="gray.200" h="4rem" w="80%" display="flex" justifyContent="center" alignItems="center">No Comments Yet</Box>
                        ) :

                            Object.keys(localComments).map((id, index) => (
                                <VStack
                                    p="0.5rem"
                                    w="80%"
                                    borderRadius="0.5rem"
                                    display="flex"
                                    flexDir="column"
                                    bg="gray.100"
                                    key={index}
                                    style={{ boxShadow: 'var(--box-shadow-classic)' }}
                                    mb="0.75rem">

                                    <Box
                                        display="flex"
                                        w="100%"
                                        p="0.5rem"
                                        flex="1"
                                        flexDirection={"column"}
                                        flexWrap="wrap"
                                        alignItems={"flex-start"}
                                        overflow="hidden"
                                        fontStyle="italic"
                                    >"{localComments[id][2]}"</Box>
                                    <Box
                                        display="flex"
                                        flexDir="row"
                                        pr="1rem"
                                        mb="0.25rem"
                                        w="100%"
                                        justifyContent="space-between"
                                    >
                                        {role !== "student" ? (
                                            <Box onClick={() => handleDeleteButton(id)}>
                                                <IoClose size="2rem" className="IoClose" />
                                            </Box>
                                        ) : (<Box></Box>)}


                                        <Text maxW={{ "xxs": "8rem", "xs": "12rem", sm: "19rem", md: "30rem" }}>
                                            -{localComments[id][0]}, {localComments[id][1]}
                                        </Text>
                                    </Box>
                                </VStack>
                            ))

                    ) :
                        <Box marginBottom="2rem">
                            <Spinner color="green.500" borderWidth="4px" cosize="xl" />
                        </Box>
                    }

                    {role !== "student" ? (
                        <Box onClick={handleAdd}><AddButton></AddButton></Box>
                    ) : (null)}


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

            </VStack>
        </Box >
    )
}

export default Student_Comments