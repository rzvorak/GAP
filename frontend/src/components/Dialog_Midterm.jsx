import React, { useState, useEffect } from 'react'
import { Input, Button } from '@chakra-ui/react'
import { IoClose } from "react-icons/io5";
import '../styles/Dialog.css'

const Dialog_Midterm = ({ setDialog }) => {
  const [fade, setFade] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const [currentPoints, setCurrentPoints] = useState("");

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
    height: "28rem",
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
    paddingLeft: "2.2rem",
    paddingTop: "1rem",
    display: "flex",
    alignItems: "center",
    fontSize: "1.2rem",
    justifyContent: "space-between",
    paddingRight: "2.5rem",
    //backgroundColor: "pink"
  }

  const dialogBody = {
    width: "100%",
    flex: "4",
    display: "flex",
    flexDirection: "column",
    paddingTop: "1rem",
    alignItems: "center",
    //backgroundColor: "lightyellow"
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
    flex: "2",
    display: "flex",
    justifyContent: 'center',
    alignItems: "center",
    //backgroundColor: "tomato"
  }

  const handleSubmitButton = async () => {
    console.log("Button clicked in dialog")

    handleExit();
  }

  const handleExit = () => {
    setFade(false);
    setTimeout(() => {
      setDialog(false);
    }, 100)
  };

  useEffect(() => {
    setFade(true)
  }, []);

  return (
    <div style={dialogContainer}>
      <div style={dialog}>
        <div style={dialogHeader}>
          <h1>Create new Monthly</h1>
          <div onClick={() => handleExit()}>
            <IoClose size="2rem" className="IoClose" />
          </div>
        </div>

        <div style={dialogBody}>
          <div style={dialogBodyText}><p>Exam Name: </p></div>
          <Input
            placeholder="Title, Description, etc."
            style={{ boxShadow: 'var(--box-shadow-classic)' }}
            border="none"
            w="80%"
            borderRadius="0.5rem"
            marginBottom="1rem"
            transition='all 0.3s'
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            _hover={{ transform: "translateY(-3px)" }}></Input>

          <div style={dialogBodyText}><p>Points: </p></div>
          <Input
            placeholder="Enter a Number"
            style={{ boxShadow: 'var(--box-shadow-classic)' }}
            border="none"
            w="80%"
            borderRadius="0.5rem"
            marginBottom="1rem"
            transition='all 0.3s'
            value={currentPoints}
            onChange={(e) => setCurrentPoints(e.target.value)}
            _hover={{ transform: "translateY(-3px)" }}></Input>
          

          <div style={dialogBodyText}><p>Subject: </p></div>
          <Input
            placeholder="Name (First Middle Sur)"
            style={{ boxShadow: 'var(--box-shadow-classic)' }}
            border="none"
            w="80%"
            borderRadius="0.5rem"
            marginBottom="1rem"
            transition='all 0.3s'

            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            _hover={{ transform: "translateY(-3px)" }}></Input>
        </div>

        <div style={dialogFooter}>
          <Button
            w="60%"
            h="2.5rem"
            borderRadius={"4rem"}
            borderWidth="2px"
            bg={currentName === "" ? "gray.300" : "green.500"}
            color="gray.100"
            fontSize="lg"
            transition="all 0.3s"
            cursor={currentName === "" ? "auto" : "pointer"}
            _hover={{ bg: currentName === "" ? "gray.300" : "green.600" }}
            onClick={handleSubmitButton}
          >Create Midterm</Button>

        </div>
      </div>
    </div>
  )
}

export default Dialog_Midterm