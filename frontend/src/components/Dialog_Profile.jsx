import React, { useState, useEffect } from 'react'
import { Input, Button, Textarea } from '@chakra-ui/react'
import { IoClose } from "react-icons/io5";
import '../styles/Dialog.css'
import { TbObjectScan } from 'react-icons/tb';

const Dialog_Profile = (props) => {
    const [fade, setFade] = useState(false);
    const [localProfile, setLocalProfile] = useState(props.currentProfile)

    const dialogContainer = {
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        height: `${(6.4 * props.categories[props.editCategory].length) + 5 + 6 + 2}rem`,


        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "hsla(0, 0%, 20%, 0.6)",
        zIndex: "4",
        opacity: fade ? "1" : "0",
        transition: "all 0.1s ease-in-out",
        overflow: "visible"

    }

    const dialog = {

        height: `${(6.4 * props.categories[props.editCategory].length) + 9}rem`,
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
        minHeight: "5rem",
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

        height: `${(6.4 * props.categories[props.editCategory].length)}rem`,
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
        marginTop: "0rem",

        minHeight: "4rem",
        display: "flex",
        justifyContent: 'center',

    }

    const handleSubmitButton = async () => {
        await props.handleSubmit(localProfile);
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

    return (
        <div style={dialogContainer}>
            <div style={dialog}>
                <div style={dialogHeader}>
                    <h1>Update Information</h1>
                    <div onClick={() => handleExit()}>
                        <IoClose size="2rem" className="IoClose" />
                    </div>
                </div>

                <div style={dialogBody}>

                    {props.categories[props.editCategory].map((field, index) => (

                        <React.Fragment key={index}>
                            <div style={dialogBodyText}><p>{field}</p></div>

                            <Input
                                style={{ boxShadow: 'var(--box-shadow-classic)' }}
                                border="none"
                                w="80%"
                                minH="2.5rem"
                                borderRadius="0.5rem"
                                marginBottom="1.5rem"
                                transition='all 0.3s'
                                maxLength={30}
                                value={localProfile[field] || ""}
                                onChange={(e) => setLocalProfile((prev) => ({ ...prev, [field]: e.target.value }))}
                                _hover={{ transform: "translateY(-3px)" }}></Input>
                        </React.Fragment>
                    ))}

                </div>



                <div style={dialogFooter}>
                    <Button
                        w="55%"
                        h="2.5rem"
                        borderRadius={"4rem"}
                        borderWidth="2px"
                        bg={(Object.keys(localProfile).length != props.categories[props.editCategory].length) ? "gray.300" : "green.500"}
                        color="gray.100"
                        fontSize="lg"
                        transition="all 0.3s"
                        disabled={(Object.keys(localProfile).length != props.categories[props.editCategory].length)}
                        cursor={(Object.keys(localProfile).length != props.categories[props.editCategory].length) ? "auto" : "pointer"}
                        _hover={{ bg: (Object.keys(localProfile).length != props.categories[props.editCategory].length) ? "gray.300" : "green.600" }}
                        onClick={handleSubmitButton}
                    >Save Information</Button>

                </div>

            </div>
        </div>
    )
}

export default Dialog_Profile