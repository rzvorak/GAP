import React, { useState, useEffect } from 'react'
import { Input, Button, Box, Spinner } from '@chakra-ui/react'
import { IoClose } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

import { InputGroup } from '../components/ui/input-group';


const Dialog_Password = (props) => {
    const [fade, setFade] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [show, setShow] = useState(true)

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
        height: "20rem",
        width: "20rem",
        backgroundColor: "#f4f4f5",
        borderRadius: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none",
    }

    const dialogHeader = {
        width: "100%",
        height: "5rem",
        paddingLeft: "2.3rem",
        paddingTop: "1.5rem",
        display: "flex",
        alignItems: "center",
        fontSize: "1.2rem",
        justifyContent: "space-between",
        paddingRight: "2.5rem"
    }

    const dialogBody = {
        width: "100%",
        height: "17rem",
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

    const dialogBodyTextUsername = {
        height: "2rem",
        display: "flex",
        width: "80%",
        paddingLeft: "0.5rem",
        userSelect: "none",
        marginBottom: "0.8rem"
    }

    const dialogFooter = {
        width: "100%",
        height: "6rem",
        display: "flex",
        justifyContent: 'center',
        alignItems: "center",
    }

    const [cooldown, setCooldown] = useState(false)
    const handleSubmitButton = async () => {
        if (currentPassword !== "") {
            if (!cooldown) {
                setCooldown(true)
                await props.handleSubmitPassword(currentPassword);
                handleExit();
            }
        }
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

    return (
        <div style={dialogContainer}>
            <div style={dialog}>
                <div style={dialogHeader}>
                    <h1>Change Password</h1>
                    <div onClick={() => handleExit()}>
                        <IoClose size="2rem" className="IoClose" />
                    </div>
                </div>

                <div style={dialogBody}>
                    <div style={dialogBodyTextUsername}><p>Username: {props.user.username.length > 19 ? props.user.username.slice(0, 18) + "..." : props.user.username} </p></div>
                    <div style={dialogBodyText}><p>New Password: </p></div>

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
                                mb="0.4rem"
                                onClick={() => setShow(!show)}>
                                {show ? <IoEyeOutline size="1.25rem" /> : <IoEyeOffOutline size="1.25rem" />}
                            </Box>
                        }>
                        <Input
                            type={show ? "password" : "text"}
                            placeholder="New Password"
                            style={{ boxShadow: 'var(--box-shadow-classic)' }}
                            border="none"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            borderRadius="0.5rem"
                            marginBottom="0.5rem"
                        ></Input>
                    </InputGroup>

                    <div style={dialogFooter}>
                        {!cooldown ? (
                            <Button
                                w="55%"
                                h="2.5rem"
                                borderRadius={"4rem"}
                                borderWidth="2px"
                                disabled={(currentPassword === "")}
                                bg={(currentPassword === "") ? "gray.300" : "green.500"}
                                color="gray.100"
                                fontSize="lg"
                                transition="all 0.3s"
                                cursor={(currentPassword === "") ? "auto" : "pointer"}
                                _hover={{ bg: (currentPassword === "") ? "gray.300" : "green.600" }}
                                onClick={handleSubmitButton}
                            >Save Password</Button>
                        ) : (
                            <Box w="80%" display="flex" alignItems="center" justifyContent="center">
                                <Spinner color="green.500" borderWidth="4px" cosize="xl" />
                            </Box>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dialog_Password