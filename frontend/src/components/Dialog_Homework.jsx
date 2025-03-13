import React, { useState, useEffect } from 'react'
import { Input, Button, createListCollection } from '@chakra-ui/react'
import { IoClose } from "react-icons/io5";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '../components/ui/select';
import { NumberInputField, NumberInputRoot, NumberInputLabel } from '../components/ui/number-input';
import '../styles/Dialog.css'
import '../styles/Dialog_Homework.css'

const Dialog_Homework = (props) => {
  const [fade, setFade] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const [currentPoints, setCurrentPoints] = useState(10);
  const [currentSubject, setCurrentSubject] = useState("")

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
    marginBottom: "9rem"
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
  }

  const dialogBody = {
    width: "100%",
    flex: "4",
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
    flex: "2",
    display: "flex",
    justifyContent: 'center',
    alignItems: "center",
  }

  const handleSubmitButton = async () => {
    console.log(currentName, currentPoints, currentSubject[0])
    await props.handleSubmitHomework(currentName, currentPoints, currentSubject[0], props.selectedClass, -1)
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

  // TODO: make global at some point
  const subjects = {
    "Class 1": ["Kiswahili", "Writing", "Numeracy", "Health", "Sports and Arts", "Reading"],
    "Class 2": ["Kiswahili", "Writing", "Arithmetic", "Health", "Sports and Arts", "Reading"],
    "Class 3": ["Kiswahili", "English", "Mathematics", "Science", "Geography", "History", "Sports and Arts"],
    "Class 4": ["Kiswahili", "English", "Mathematics", "Science", "Civics", "Social Studies"],
    "Class 5": ["Kiswahili", "English", "Mathematics", "Science", "Civics", "Social Studies", "Vocational Skills"],
    "Class 6": ["Kiswahili", "English", "Mathematics", "Science", "Civics", "Social Studies", "Vocational Skills"],
    "Class 7": ["Kiswahili", "English", "Mathematics", "Science", "Civics", "Social Studies", "Vocational Skills"]
  }

  // specifically for functionality with chakra select
  const frameworks = createListCollection({
    items: subjects[props.selectedClass].map((subject) => {
      return ({ label: subject, value: subject });
    })
  })

  return (
    <div style={dialogContainer}>
      <div style={dialog}>
        <div style={dialogHeader}>
          <h1>Create new Homework</h1>
          <div onClick={() => handleExit()}>
            <IoClose size="2rem" className="IoClose" />
          </div>
        </div>

        <div style={dialogBody}>
          <div style={dialogBodyText}><p>Assignment Name: </p></div>
          <Input
            placeholder="Title, Description, etc."
            style={{ boxShadow: 'var(--box-shadow-classic)' }}
            border="none"
            maxLength={50}
            w="80%"
            borderRadius="0.5rem"
            marginBottom="1rem"
            transition='all 0.3s'
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            _hover={{ transform: "translateY(-3px)" }}></Input>

          <div style={dialogBodyText}><p>Points: </p></div>
          <NumberInputRoot
            defaultValue="10"
            w="80%"
            borderRadius="0.5rem"
            marginBottom="1rem"
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

          <div style={dialogBodyText}><p>Subject: </p></div>
          <SelectRoot
            collection={frameworks}
            value={currentSubject}
            onValueChange={(e) => setCurrentSubject(e.value)}
            w="80%"
            borderRadius="0.5rem"
            border="none"
            transition="all 0.3s"
            positioning={{ placement: "bottom", flip: false }}
            _hover={{ transform: "translateY(-3px)" }}
            style={{ boxShadow: 'var(--box-shadow-classic)' }}>
            <SelectTrigger>
              <SelectValueText
                placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent padding="0" backgroundColor="gray.100">
              {frameworks.items.map((subject) => {
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
                    item={subject}
                    key={subject.value}>
                    {subject.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </SelectRoot>
        </div>

        <div style={dialogFooter}>
          <Button
            w="60%"
            h="2.5rem"
            borderRadius={"4rem"}
            borderWidth="2px"
            bg={currentName === "" || currentSubject === "" ? "gray.300" : "green.500"}
            color="gray.100"
            fontSize="lg"
            transition="all 0.3s"
            cursor={currentName === "" ? "auto" : "pointer"}
            _hover={{ bg: currentName === "" ? "gray.300" : "green.600" }}
            onClick={handleSubmitButton}
          >Create Homework</Button>

        </div>
      </div>
    </div>
  )
}

export default Dialog_Homework