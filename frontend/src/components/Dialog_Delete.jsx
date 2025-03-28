import React, { useState, useEffect } from 'react'
import { Button, Box, Spinner } from '@chakra-ui/react'
import { IoClose } from "react-icons/io5";

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

  const [cooldown, setCooldown] = useState(false)
  const handleConfirmButton = async () => {
    if (!cooldown) {
      setCooldown(true)
      await props.delete(props.id);
      handleExit();
      props.handleBack();
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
          {!cooldown ? (
            <Button
              w="80%"
              h="2.5rem"
              borderRadius={"4rem"}
              borderWidth="2px"
              bg={(props.id !== "critical" ? "green.500" : "red.500")}
              color="gray.100"
              fontSize="lg"
              transition="all 0.3s"
              cursor="pointer"
              _hover={{ bg: (props.id !== "critical" ? "green.600" : "red.600") }}
              onClick={handleConfirmButton}
            >Confirm Deletion</Button>) : (
            <Box w="80%" display="flex" alignItems="center" justifyContent="center">
              <Spinner color="green.500" borderWidth="4px" cosize="xl" />
            </Box>
          )}
          <div onClick={() => handleExit()}>
            <IoClose size="2rem" className="IoClose" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dialog_Delete