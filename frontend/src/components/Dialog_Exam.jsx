import React, { useState, useEffect } from 'react'
import { Button } from '@chakra-ui/react'
import { IoClose } from "react-icons/io5";
import { NumberInputField, NumberInputRoot } from '../components/ui/number-input';

const Dialog_Exam = (props) => {
    const [fade, setFade] = useState(false);
    // TODO: potentially add settings option for default exam points
    const [currentPoints, setCurrentPoints] = useState(50);

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
        height: props.selectedType === "monthly" ? "28rem" : "20rem",
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
        flex: "1",
        paddingLeft: "2.5rem",
        paddingTop: "1rem",
        display: "flex",
        alignItems: "center",
        fontSize: "1rem",
        justifyContent: "space-between",
        paddingRight: "2.4rem",
    }

    const dialogBody = {
        width: "100%",
        flex: "3",
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
        marginBottom: "0.2rem",
    }

    const dialogFooter = {
        width: "100%",
        flex: "2",
        paddingTop: props.selectedType === "monthly" ? "0rem" : "0rem",
        display: "flex",
        justifyContent: 'center',
        alignItems: "center",
    }

    const [hoverState, setHoverState] = useState({
        "Jan": false,
        "Feb": false,
        "Mar": false,
        "Apr": false,
        "May": false,
        "Jun": false,
        "Jul": false,
        "Aug": false,
        "Sep": false,
        "Oct": false,
        "Nov": false,
        "Dec": false,
    });

    const dialogMonthSelect = {
        width: "80%",
        height: "4rem",
        display: "flex",
        flexDirection: "row",
        cursor: "pointer",
    }

    const dialogTermSelect = {
        width: "75%",
        //backgroundColor: "orange",
        height: "2rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        cursor: "pointer",
    }

    const dialogTerm = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    }

    const dialogMonth = {
        height: "100%",
        flex: "1",
        display: 'flex',
        flexDirection: 'column',
        maxWidth: "3rem",
        justifyContent: 'center',
        alignItems: 'center'
    }

    const dialogMonthButton = (isHovered, isSelected) => ({
        height: "0.7rem",
        width: "0.7rem",
        backgroundColor: isSelected ? "#22c55e" : isHovered ? "#22c55e" : "lightgray",
        borderRadius: "0.5rem",
        marginTop: props.selectedType === "monthly" ? "0.7rem" : "0rem",
        marginRight: props.selectedType === "monthly" ? "0rem" : "0.7rem",
        transition: "all 0.2s ease-in-out",
    });

    const [selectedMonth, setSelectedMonth] = useState(props.selectedType === "monthly" ? "Jan" : (props.selectedType === "midterm" ? "Apr" : "Jun"));

    const handleHover = (month, isHovered) => {
        setHoverState(prevState => ({
            ...prevState,
            [month]: isHovered
        }));
    }

    const handleMonthSelect = (month) => {
        if (selectedMonth !== month) {
            setSelectedMonth(month);
        }
    };

    const handleSubmitButton = async () => {
        await props.handleSubmitExam(currentPoints, selectedMonth, -1)
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
                    <h1>Create new {props.capitalizedType} Exam</h1>
                    <div onClick={() => handleExit()}>
                        <IoClose size="2rem" className="IoClose" />
                    </div>
                </div>

                <div style={dialogBody}>

                    {props.selectedType === "monthly" ? (
                        <>
                            <div style={dialogMonthSelect}>
                                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(month => (
                                    <div
                                        key={month}
                                        onClick={() => handleMonthSelect(month)}
                                        onMouseEnter={() => handleHover(month, true)}
                                        onMouseLeave={() => handleHover(month, false)}
                                        style={dialogMonth}>
                                        {month}
                                        <div style={dialogMonthButton(hoverState[month], selectedMonth === month)}></div>
                                    </div>
                                ))}
                            </div>
                            <div style={dialogMonthSelect}>
                                {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(month => (
                                    <div
                                        key={month}
                                        onClick={() => handleMonthSelect(month)}
                                        onMouseEnter={() => handleHover(month, true)}
                                        onMouseLeave={() => handleHover(month, false)}
                                        style={dialogMonth}>
                                        {month}
                                        <div style={dialogMonthButton(hoverState[month], selectedMonth === month)}></div>
                                    </div>
                                ))}
                            </div>
                            <div style={dialogBodyText}></div>
                        </>
                    ) : (
                        <>
                            <div style={dialogTermSelect}>
                                <div
                                    onClick={() => handleMonthSelect(props.selectedType === "midterm" ? "Apr" : "Jun")}
                                    onMouseEnter={() => handleHover(props.selectedType === "midterm" ? "Apr" : "Jun", true)}
                                    onMouseLeave={() => handleHover(props.selectedType === "midterm" ? "Apr" : "Jun", false)}
                                    style={dialogTerm}>
        
                                    <div style={dialogMonthButton(hoverState[props.selectedType === "midterm" ? "Apr" : "Jun"], selectedMonth === (props.selectedType === "midterm" ? "Apr" : "Jun"))}></div>
                                    {props.selectedType === "midterm" ? "Term 1 (Apr)" : "Term 1 (Jun)"}
                                </div>

                                <div
                                    onClick={() => handleMonthSelect(props.selectedType === "midterm" ? "Sep" : "Dec")}
                                    onMouseEnter={() => handleHover(props.selectedType === "midterm" ? "Sep" : "Dec", true)}
                                    onMouseLeave={() => handleHover(props.selectedType === "midterm" ? "Sep" : "Dec", false)}
                                    style={dialogTerm}>
        
                                    <div style={dialogMonthButton(hoverState[props.selectedType === "midterm" ? "Sep" : "Dec"], selectedMonth === (props.selectedType === "midterm" ? "Sep" : "Dec"))}></div>
                                    {props.selectedType === "midterm" ? "Term 2 (Sep)" : "Term 2 (Dec)"}
                                </div>

                            </div>
                            <div style={dialogBodyText}></div>
                        </>
                    )}


                    <div style={dialogBodyText}><p>Points (Questions per Subject): </p></div>
                    <NumberInputRoot
                        defaultValue="10"
                        w="75%"
                        borderRadius="0.5rem"
                        transition="all 0.3s"
                        value={currentPoints}
                        onValueChange={(e) => setCurrentPoints(Math.max(0, Math.min(100, e.value)))}
                        min={1}
                        max={100}
                        style={{ boxShadow: 'var(--box-shadow-classic)' }}
                        _hover={{ transform: "translateY(-3px)" }}
                    >
                        <NumberInputField borderWidth={"0"} />
                    </NumberInputRoot>
                </div>

                <div style={dialogFooter}>
                    <Button
                        w="50%"
                        h="2.5rem"
                        borderRadius={"4rem"}
                        borderWidth="2px"
                        bg="green.500"
                        color="gray.100"
                        fontSize="lg"
                        transition="all 0.3s"
                        cursor="pointer"
                        _hover={{ bg: "green.600" }}
                        onClick={handleSubmitButton}
                    >Create Exam</Button>

                </div>
            </div>
        </div>
    )
}

export default Dialog_Exam