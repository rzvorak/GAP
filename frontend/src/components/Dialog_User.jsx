import React, { useState, useEffect } from 'react'
import { Button, Box, createListCollection, Input, VStack } from '@chakra-ui/react'
import { IoClose } from "react-icons/io5";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '../components/ui/select';

import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

import { InputGroup } from '../components/ui/input-group';


const Dialog_User = (props) => {
    const [fade, setFade] = useState(false);
    const [show, setShow] = useState(true);

    const dialogContainer = {
        position: "fixed",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "hsla(0, 0%, 20%, 0.6)",
        zIndex: "4",
        opacity: fade ? "1" : "0",
        transition: "all 0.1s ease-in-out"
    }

    const dialog = {
        height: "23rem",
        width: "20rem",
        backgroundColor: "#f4f4f5",
        borderRadius: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none",
        marginBottom: "9rem"
    }

    const dialogHeader = {
        width: "100%",
        height: "4rem",
        paddingLeft: "2.2rem",
        paddingTop: "1rem",
        display: "flex",
        alignItems: "center",
        fontSize: "1.2rem",
        justifyContent: "space-between",
        paddingRight: "2.5rem",
    }

    const dialogBody = {
        width: "100%",

        height: "13rem",
        display: "flex",
        flexDirection: "column",
        paddingTop: "1rem",
        alignItems: "center",
    }

    const dialogBodyText = {
        height: "2rem",
        display: "flex",
        width: "80%",
        paddingLeft: "0.5rem",
        userSelect: "none",
        marginBottom: "0.2rem"
    }

    const dialogFooter = {
        width: "100%",
        height: "5rem",
        display: "flex",
        justifyContent: 'center',
        alignItems: "center",
    }

    const [currentPassword, setCurrentPassword] = useState("")
    const [currentStudent, setCurrentStudent] = useState("")
    const [currentTeacher, setCurrentTeacher] = useState("")

    const handleSubmitButton = async () => {
        props.mode === "student" ? await props.createStudentAccount(currentStudent[0], currentPassword) : await props.createTeacherAccount(currentTeacher, currentPassword)

        handleExit();
    }

    const handleExit = () => {
        setFade(false);
        setTimeout(() => {
            props.setDialog(false);
        }, 100)
    };

    useEffect(() => {
        setFade(true)
    }, []);

    const existingIds = props.users.map((user) => user.identity)

    // specifically for functionality with chakra select
    const filteredStudents = props.students
        .filter((student) => !existingIds.includes(student._id))
        .map((student) => ({ label: student.name, value: student._id }));

    const frameworks = createListCollection({ items: filteredStudents });


    // TODO: laggy with a lot of students
    return (
        <div style={dialogContainer}>
            <div style={dialog}>
                <div style={dialogHeader}>
                    <h1>Create Account</h1>
                    <div onClick={() => handleExit()}>
                        <IoClose size="2rem" className="IoClose" />
                    </div>
                </div>

                <div style={dialogBody}>

                    <div style={dialogBodyText}><p>Name: </p></div>

                    {props.mode === "student" ? (
                        <SelectRoot
                            mb="1.5em"
                            collection={frameworks}
                            value={currentStudent}
                            onValueChange={(e) => setCurrentStudent(e.value)}
                            w="80%"
                            borderRadius="0.5rem"
                            border="none"
                            transition="all 0.3s"
                            positioning={{ placement: "bottom", flip: false }}
                            _hover={{ transform: "translateY(-3px)" }}
                            style={{ boxShadow: 'var(--box-shadow-classic)' }}>
                            <SelectTrigger>
                                <SelectValueText
                                    placeholder="" />
                            </SelectTrigger>
                            <SelectContent padding="0" backgroundColor="gray.100">
                                {frameworks.items.map((student) => {
                                    return (
                                        <SelectItem
                                            cursor="pointer"
                                            paddingLeft="1rem"
                                            paddingTop="0.6rem"
                                            paddingBottom="0.6rem"
                                            backgroundColor="gray.100"
                                            borderWidth="0rem"
                                            color="black"
                                            transition="all 0.2s"
                                            _hover={{ backgroundColor: "gray.200" }}
                                            item={student}
                                            key={student.value}>
                                            {student.label}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </SelectRoot>

                    ) : (
                        <Input
                            placeholder="Teacher Name"
                            style={{ boxShadow: 'var(--box-shadow-classic)' }}
                            border="none"
                            maxLength={30}
                            w="80%"
                            borderRadius="0.5rem"
                            marginBottom="1rem"
                            transition='all 0.3s'
                            value={currentTeacher}
                            onChange={(e) => setCurrentTeacher(e.target.value)}
                            _hover={{ transform: "translateY(-3px)" }}></Input>
                    )}


                    <div style={dialogBodyText}><p>Password: </p></div>

                    <InputGroup
                        w="80%"
                        transition='all 0.3s'
                        _hover={{ transform: "translateY(-3px)" }}
                        endElement={
                            <Box
                                h="100%"
                                display="flex"
                                color="green.500"
                                alignItems="center"
                                mb="1rem"
                                onClick={() => setShow(!show)}>
                                {show ? <IoEyeOutline size="1.25rem" /> : <IoEyeOffOutline size="1.25rem" />}
                            </Box>
                        }>
                        <Input
                            maxLength={30}
                            type={show ? "password" : "text"}
                            placeholder="New Password"
                            style={{ boxShadow: 'var(--box-shadow-classic)' }}
                            border="none"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            borderRadius="0.5rem"
                            marginBottom="1rem"
                        ></Input>
                    </InputGroup>


                </div>

                <div style={dialogFooter}>
                    <Button
                        w="55%"
                        h="2.5rem"
                        borderRadius={"4rem"}
                        borderWidth="2px"
                        disabled={currentStudent === "" && currentTeacher === ""}
                        bg={currentStudent === "" && currentTeacher === "" ? "gray.300" : "green.500"}
                        color="gray.100"
                        fontSize="lg"
                        transition="all 0.3s"
                        cursor={currentStudent === "" && currentTeacher === "" ? "auto" : "pointer"}
                        _hover={{ bg: currentStudent === "" && currentTeacher === "" ? "gray.300" : "green.600" }}
                        onClick={handleSubmitButton}
                    >Create Account</Button>

                </div>
            </div>
        </div>
    )
}

export default Dialog_User