import React, { useState, useEffect } from 'react'
import { Input, Button, Spinner, Box } from '@chakra-ui/react'
import { IoClose } from "react-icons/io5";

const Dialog_Subjects = (props) => {
    const [fade, setFade] = useState(false);
    const [currentSubject, setCurrentSubject] = useState("");

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
        height: "16rem",
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
        height: "4rem",
        paddingLeft: "2.3rem",
        paddingTop: "1rem",
        display: "flex",
        alignItems: "center",
        fontSize: "1.2rem",
        justifyContent: "space-between",
        paddingRight: "2.5rem"
    }

    const dialogBody = {
        width: "100%",
        height: "15rem",
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
        height: "4rem",
        display: "flex",
        justifyContent: 'center',
        alignItems: "center",
    }

    const [cooldown, setCooldown] = useState(false)
    const handleSubmitButton = () => {
        if (currentSubject !== "") {
            if (!cooldown) {
                setCooldown(true)
                props.handleSubmitSubject(currentSubject);
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
                    <h1>Create a Subject</h1>
                    <div onClick={() => handleExit()}>
                        <IoClose size="2rem" className="IoClose" />
                    </div>
                </div>

                <div style={dialogBody}>
                    <div style={dialogBodyText}><p>New Subject: </p></div>
                    <Input
                        placeholder="Mathematics, Kiswahili, etc."
                        style={{ boxShadow: 'var(--box-shadow-classic)' }}
                        border="none"
                        w="80%"
                        borderRadius="0.5rem"
                        marginBottom="1.5rem"
                        transition='all 0.3s'
                        maxLength={30}
                        value={currentSubject}
                        onChange={(e) => setCurrentSubject(e.target.value)}
                        _hover={{ transform: "translateY(-3px)" }}></Input>

                    <div style={dialogFooter}>
                        {!cooldown ? (
                            <Button
                                w="55%"
                                h="2.5rem"
                                borderRadius={"4rem"}
                                borderWidth="2px"
                                disabled={(currentSubject === "")}
                                bg={(currentSubject === "") ? "gray.300" : "green.500"}
                                color="gray.100"
                                fontSize="lg"
                                transition="all 0.3s"
                                cursor={(currentSubject === "") ? "auto" : "pointer"}
                                _hover={{ bg: (currentSubject === "") ? "gray.300" : "green.600" }}
                                onClick={handleSubmitButton}
                            >Save Subject</Button>
                        ) : (
                            <Box w="100%" display="flex" alignItems="center" justifyContent="center">
                                <Spinner color="green.500" borderWidth="4px" cosize="xl" />
                            </Box>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Dialog_Subjects