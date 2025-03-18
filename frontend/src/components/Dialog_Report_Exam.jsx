import React, { useState, useEffect } from 'react'
import { Input, Button, createListCollection } from '@chakra-ui/react'
import { IoClose } from "react-icons/io5";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '../components/ui/select';
import '../styles/Dialog.css'
import '../styles/Dialog_Homework.css'


const Dialog_Report_Exam = (props) => {
  const [fade, setFade] = useState(false);
  const [currentExam, setCurrentExam] = useState("")

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
    height: "17rem",
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
    height: "7rem",
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

  const handleSubmitButton = async () => {
    await props.createExamPDF(currentExam[0])
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

  // specifically for functionality with chakra select
  const frameworks = createListCollection({
    items: props.exams.map((exam) => {
      return ({ label: exam.type, value: exam._id });
    })
  })

  return (
    <div style={dialogContainer}>
      <div style={dialog}>
        <div style={dialogHeader}>
          <h1>Create Report</h1>
          <div onClick={() => handleExit()}>
            <IoClose size="2rem" className="IoClose" />
          </div>
        </div>

        <div style={dialogBody}>

          <div style={dialogBodyText}><p>Select Exam: </p></div>
          <SelectRoot
            collection={frameworks}
            value={currentExam}
            onValueChange={(e) => setCurrentExam(e.value)}
            w="80%"
            borderRadius="0.5rem"
            border="none"
            transition="all 0.3s"
            positioning={{ placement: "bottom", flip: false }}
            _hover={{ transform: "translateY(-3px)" }}
            style={{ boxShadow: 'var(--box-shadow-classic)' }}>
            <SelectTrigger>
              <SelectValueText
                placeholder="Select Exam" />
            </SelectTrigger>
            <SelectContent padding="0" backgroundColor="gray.100">
              {frameworks.items.map((exam) => {
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
                    item={exam}
                    key={exam.value}>
                    {exam.label}
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
            disabled={currentExam === ""}
            bg={currentExam === "" ? "gray.300" : "green.500"}
            color="gray.100"
            fontSize="lg"
            transition="all 0.3s"
            cursor={currentExam === "" ? "auto" : "pointer"}
            _hover={{ bg: currentExam === "" ? "gray.300" : "green.600" }}
            onClick={handleSubmitButton}
          >Download PDF</Button>

        </div>
      </div>
    </div>
  )
}

export default Dialog_Report_Exam