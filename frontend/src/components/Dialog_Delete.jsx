import React, { useState, useEffect } from 'react'
import { Input, Button, createListCollection } from '@chakra-ui/react'
import { IoClose } from "react-icons/io5";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '../components/ui/select';
import { NumberInputField, NumberInputRoot, NumberInputLabel } from '../components/ui/number-input';
import '../styles/Dialog.css'
import '../styles/Dialog_Homework.css'

const Dialog_Delete = (props) => {
  const [fade, setFade] = useState(false);

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
    height: "7rem",
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
    paddingLeft: "2rem",
    display: "flex",
    alignItems: "center",
    fontSize: "1.2rem",
    justifyContent: "space-between",
    paddingRight: "2rem",
    paddingTop: "0.25rem"
  }

  const handleConfirmButton = async () => {
    await props.delete(props.id);  
    handleExit();
    props.handleBack();
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
          <Button
            w="80%"
            h="2.5rem"
            borderRadius={"4rem"}
            borderWidth="2px"
            bg="green.500"
            color="gray.100"
            fontSize="lg"
            transition="all 0.3s"
            cursor="pointer"
            _hover={{bg: "green.600" }}
            onClick={handleConfirmButton}
          >Confirm Deletion</Button>
          <div onClick={() => handleExit()}>
            <IoClose size="2rem" className="IoClose" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dialog_Delete