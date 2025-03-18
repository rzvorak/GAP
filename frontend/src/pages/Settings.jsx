import React, { useState, useEffect } from 'react'
import { Box, VStack, Heading, useBreakpointValue, Spinner, Text, HStack, SimpleGrid, Button } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

import { FaArrowLeft } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { IoWarningOutline } from "react-icons/io5";

import { useStudentStore } from '../store/student.js';
import { useHomeworkStore } from '../store/homework.js';
import { useExamStore } from '../store/exam.js'

import Dialog_Delete from '../components/Dialog_Delete';
import Dialog_Subjects from '../components/Dialog_Subjects';

import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from '../components/ui/accordion'
import { NumberInputField, NumberInputRoot } from '../components/ui/number-input';

// TODO: handle change in subject affecting existing exams, possibly delete all exams when change and notify
const Settings = () => {
  const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })

  const { fetchStudents, deleteStudent, students } = useStudentStore();
  const { fetchHomeworks, deleteHomework, homeworks } = useHomeworkStore();
  const { fetchExams, deleteExam, exams } = useExamStore();

  const [settings, setSettings] = useState({})
  const [localDistribution, setLocalDistribution] = useState({})
  const [localCutoffs, setLocalCutoffs] = useState({})
  const [localSubjects, setLocalSubjects] = useState({})


  const [isSettingsLoading, setIsSettingsLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data.data)
      setLocalDistribution(data.data.distribution)
      setLocalCutoffs(data.data.cutoffs)
      setLocalSubjects(data.data.subjects)
      setIsSettingsLoading(false)
    }
    fetchSettings()
    fetchStudents()
    fetchHomeworks()
    fetchExams()
  }, [])

  useEffect(() => {

  })

  const handleSaveButton = async () => {

    const updatedSettings = {
      distribution: localDistribution,
      cutoffs: localCutoffs,
      subjects: localSubjects,

    }

    const res = await fetch(`/api/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSettings),
    });
    const data = await res.json();
    console.log("success:", data.success)

  }


  const defaultSettings = {
    distribution: { "homework": 10, "monthly": 20, "midterm": 20, "terminal": 50 },
    cutoffs: { "A": 81, "B": 61, "C": 41, "D": 21, "F": 0 },
    subjects: {
      1: ["Kiswahili", "Writing", "Numeracy", "Health", "Sports and Arts", "Reading"],
      2: ["Kiswahili", "Writing", "Arithmetic", "Health", "Sports and Arts", "Reading"],
      3: ["Kiswahili", "English", "Mathematics", "Science", "Geography", "History", "Sports and Arts"],
      4: ["Kiswahili", "English", "Mathematics", "Science", "Civics", "Social Studies"],
      5: ["Kiswahili", "English", "Mathematics", "Science", "Civics", "Social Studies", "Vocational Skills"],
      6: ["Kiswahili", "English", "Mathematics", "Science", "Civics", "Social Studies", "Vocational Skills"],
      7: ["Kiswahili", "English", "Mathematics", "Science", "Civics", "Social Studies", "Vocational Skills"]
    }
  }

  const restoreButtonBreakpoint = useBreakpointValue({ "xxs": "", sm: "Settings" });
  const handleRestoreButton = () => {
    setLocalDistribution(defaultSettings.distribution)
    setLocalCutoffs(defaultSettings.cutoffs)
    setLocalSubjects(defaultSettings.subjects)
  }

  // for subjects logic
  const [dialogDeleteSubject, setDialogDeleteSubject] = useState(false)
  const [deleteId, setDeleteId] = useState({})
  const handleDeleteSubjectButton = (currentClass, subject) => {
    setDeleteId({ class: currentClass, subject: subject })
    setDialogDeleteSubject(!dialogDeleteSubject);
  }

  const deleteSubject = (deleteId) => {
    const updatedSubjects = { ...localSubjects }
    updatedSubjects[deleteId.class] = updatedSubjects[deleteId.class].filter(
      (subject) => subject !== deleteId.subject
    );
    setLocalSubjects(updatedSubjects)
  }

  const handleDeleteBack = () => {
    console.log("Successfully deleted")
  }

  const [dialog, setDialog] = useState(false);
  const [currentClass, setCurrentClass] = useState("")
  const handleAddButton = (currentClass) => {
    setCurrentClass(currentClass)
    setDialog(!dialog);
  }

  const handleSubmitSubject = (newSubject) => {
    const updatedSubjects = {
      ...localSubjects,
      [currentClass]: [
        ...localSubjects[currentClass],
        newSubject
      ]
    }
    setLocalSubjects(updatedSubjects)
  }

  const [dialogDeleteStudents, setDialogDeleteStudents] = useState(false)
  const handleDeleteStudentsButton = () => {
    setDialogDeleteStudents(!dialogDeleteStudents);
  }

  const [dialogDeleteHomework, setDialogDeleteHomework] = useState(false)
  const handleDeleteHomeworkButton = () => {
    setDialogDeleteHomework(!dialogDeleteHomework);
  }

  const [dialogDeleteExams, setDialogDeleteExams] = useState(false)
  const handleDeleteExamsButton = () => {
    setDialogDeleteExams(!dialogDeleteExams);
  }

  const deleteAllExams = async (ignore) => {
    exams.forEach(exam => {
      deleteExam(exam._id)
    })

  }

  const deleteAllHomework = async (ignore) => {
    homeworks.forEach(homework => {
       deleteHomework(homework._id)
    })

  }

  const deleteAllStudents = async (ignore) => {
    students.forEach(student => {
      deleteStudent(student._id)
    })
  }


  const cutoffBackground = {
    "A": "green.700",
    "B": "green.600",
    "C": "green.500",
    "D": "green.400",
    "F": "green.300"
  }
  const cutoffColumns = useBreakpointValue({ "xxs": 1, "xs": 2, sm: 2, md: 4 })



  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/landing')
  }

  return (
    <Box
      minH={"100vh"}
      maxW={"100vw"}
      bg={"gray.100"}
      color="gray.900"
      display="flex"
      flexDir={"column"}
    >
      <Header></Header>

      {dialogDeleteExams && <Dialog_Delete handleBack={handleDeleteBack} delete={deleteAllExams} id={"critical"} setDialog={setDialogDeleteExams}></Dialog_Delete>}
      {dialogDeleteHomework && <Dialog_Delete handleBack={handleDeleteBack} delete={deleteAllHomework} id={"critical"} setDialog={setDialogDeleteHomework}></Dialog_Delete>}
      {dialogDeleteStudents && <Dialog_Delete handleBack={handleDeleteBack} delete={deleteAllStudents} id={"critical"} setDialog={setDialogDeleteStudents}></Dialog_Delete>}
      {dialogDeleteSubject && <Dialog_Delete handleBack={handleDeleteBack} delete={deleteSubject} id={deleteId} setDialog={setDialogDeleteSubject}></Dialog_Delete>}
      {dialog && <Dialog_Subjects handleSubmitSubject={handleSubmitSubject} currentClass={currentClass} setDialog={setDialog}></Dialog_Subjects>}




      {!isSettingsLoading ? (

        <VStack
          flex="1"
          display={disappearOnMin}
          flexDir="column"
          w="100%">
          <Box
            w="100%"
            h="4rem"
            display="flex"
            alignItems={"center"}>
            <Heading
              marginLeft="1rem"
              color="gray.600"
              fontSize="2xl"
              fontWeight={"400"}
            >School Settings</Heading>
          </Box>

          <Box
            w="80%"
            h={{ sm: "3rem" }}
            display="flex"
            alignItems={"center"}>
            <Heading
              color="gray.600"
              fontSize="xl"
              fontWeight={"400"}
            >Distribution:</Heading>
          </Box>

          {Object.keys(localDistribution).map((type, index) => (
            <Box w="80%"
              display="flex"
              key={index}>

              <VStack
                w={{ "xxs": "25rem", "xs": "25rem", sm: "20rem" }}
              >
                <Box
                  display="flex"
                  flexDir="row"
                  justifyContent="space-between"
                  alignItems="center"
                  pr="1rem"
                  w="100%"
                >
                  <Text w={{ "xxs": "60%", "xs": "60%", sm: "45%" }}>{type.charAt(0).toUpperCase() + type.slice(1)}:</Text>
                  <NumberInputRoot
                    defaultValue="10"
                    w={{ "xxs": "40%", "xs": "40%", sm: "55%" }}
                    h="fill"
                    borderRadius="0.5rem"
                    transition="all 0.3s"
                    value={localDistribution[type]}
                    onValueChange={(e) => setLocalDistribution({
                      ...localDistribution,
                      [type]: Math.max(0, Math.min(100, e.value))
                    })}
                    min={0}
                    max={100}
                    style={{ boxShadow: 'var(--box-shadow-classic)' }}
                    _hover={{ transform: "translateY(-3px)" }}
                  >
                    <NumberInputField borderWidth={"0"} />
                  </NumberInputRoot>
                </Box>
              </VStack>

              <HStack
                w={{ "xxs": "50%", "xs": "60%", sm: "70%" }}
                gap="0rem"
              //bg="blue"
              >
                <Box h="100%" borderRadius="0.1rem" w="0.25rem" bg="gray.700"></Box>

                <Box h="80%" bg="green.500" borderRightRadius="0.5rem" w={localDistribution[type] + "%"}></Box>

              </HStack>
            </Box>))}

          <Box
            w="80%"
            h={{ sm: "3rem" }}
            display="flex"
            alignItems={"center"}>
            <Heading
              color="gray.600"
              fontSize="xl"
              fontWeight={"400"}
            >Grade Cutoffs:</Heading>
          </Box>

          <VStack w="80%" justifyContent="center">

            {localCutoffs["A"] > localCutoffs["B"] && localCutoffs["B"] > localCutoffs["C"] && localCutoffs["C"] > localCutoffs["D"] ? (

              <Box h="1.5rem" w="100%" display="flex" justifyContent="flex-start">
                <Box
                  bg={cutoffBackground["A"]}
                  w={(100 - localCutoffs["A"]) + "%"}
                ></Box>

                <Box
                  bg={cutoffBackground["B"]}
                  w={(localCutoffs["A"] - localCutoffs["B"]) + "%"}
                ></Box>

                <Box
                  bg={cutoffBackground["C"]}
                  w={(localCutoffs["B"] - localCutoffs["C"]) + "%"}
                ></Box>

                <Box
                  bg={cutoffBackground["D"]}
                  w={(localCutoffs["C"] - localCutoffs["D"]) + "%"}
                ></Box>

                <Box
                  bg={cutoffBackground["F"]}
                  w={(localCutoffs["D"] - localCutoffs["F"]) + "%"}
                ></Box>
              </Box>

            ) : (
              <Box h="1.5rem" w="100%" display="flex" justifyContent="center" bg="gray.200"></Box>
            )}


            <SimpleGrid
              columns={cutoffColumns}
              w="100%">
              {Object.keys(localCutoffs).map((grade, index) => (
                grade !== "F" ?
                  <Box
                    display="flex"
                    flexDir="row"
                    alignItems="center"
                    p="1rem"
                    key={index}
                  >
                    <Text mr="1rem">{grade}:</Text>
                    <NumberInputRoot
                      defaultValue="10"
                      w="90%"
                      h="fill"
                      borderRadius="0.5rem"
                      transition="all 0.3s"
                      value={localCutoffs[grade]}
                      onValueChange={(e) => setLocalCutoffs({
                        ...localCutoffs,
                        [grade]: Math.max(0, Math.min(100, e.value))
                      })}
                      min={0}
                      max={100}
                      style={{ boxShadow: 'var(--box-shadow-classic)' }}
                      _hover={{ transform: "translateY(-3px)" }}
                    >
                      <NumberInputField borderWidth={"0"} />
                    </NumberInputRoot>
                  </Box>
                  : (null)))}
            </SimpleGrid>
          </VStack>



          <Box
            w="80%"
            h={{ sm: "3rem" }}
            display="flex"
            alignItems={"center"}>
            <Heading
              color="gray.600"
              fontSize="xl"
              fontWeight={"400"}
            >Class Subjects:</Heading>
          </Box>

          <SimpleGrid columns={1} w="80%">
            {Object.keys(localSubjects).map((currentClass, index) => (
              <HStack key={index} w="100%" mb="1rem"  >
                <Box h="100%" borderRadius="0.1rem" minW="0.2rem" bg="gray.700" >

                </Box>

                <Box
                  h="fit-content"
                  display="flex"
                  flexDir="row"
                  flexWrap="wrap">
                  <Text display="flex" mr="0.5rem" alignItems="center">Class {currentClass}:</Text>

                  {localSubjects[currentClass].map((subject, sindex) => (
                    <Box
                      key={sindex}
                      bg="gray.200"
                      w="fit-content"
                      display="flex"
                      borderRadius="0.75rem"
                      justifyContent="center"
                      alignItems="center"
                      p="0.75rem"
                      pr="0.5rem"
                      mx="0.2rem"
                      my="0.4rem"
                      h="2rem">

                      <Text
                        whiteSpace="nowrap"
                        color="gray.500"
                        mr="0.2rem"

                      >{subject}</Text>

                      <Box mt="0.1rem" onClick={() => handleDeleteSubjectButton(currentClass, subject)}>
                        <IoClose size="1.5rem" className="IoClose" />
                      </Box>

                    </Box>
                  ))}

                  <Box
                    border="2px solid gray"
                    borderRadius="0.4rem"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    h="1.5rem"
                    w="1.5rem"
                    cursor="pointer"
                    my="0.6rem"
                    mx="0.4rem"
                    onClick={() => handleAddButton(currentClass)}
                    transition="all 0.3s ease-in-out"
                    _hover={{ transform: "translateY(-3px)" }}
                  >
                    <FaPlus color="gray" size="1rem" className="FaPlus" />
                  </Box>

                </Box>

              </HStack>

            ))}
          </SimpleGrid>






          <Box
            w="80%"
            h={{ sm: "3rem" }}
            display="flex"
            alignItems={"center"}>
            <Heading
              color="gray.600"
              fontSize="xl"
              fontWeight={"400"}
            >Student Information:</Heading>
          </Box>




          <AccordionRoot
            w="80%"
            variant={"plain"}
            collapsible
            multiple
            borderRadius="0"
          >
            <AccordionItem
              borderRadius="0"
              marginBottom="1rem"
              value={"danger"}>
              <AccordionItemTrigger
                p="0.75rem"
                cursor="pointer"
                h="3.5rem"
                bg="gray.100"
                fontWeight="400"
                display="flex"
                style={{ boxShadow: 'var(--box-shadow-classic)' }}
              >

                <Box w="100%" display="flex" justifyContent="center">
                  <Box mt="0.25rem" mr="0.5rem">
                    <IoWarningOutline size="1rem" color="orange" />
                  </Box>

                  System Reset

                  <Box mt="0.25rem" ml="0.5rem">
                    <IoWarningOutline size="1rem" color="orange" />
                  </Box>
                </Box>


              </AccordionItemTrigger>
              <AccordionItemContent

                //bg="gray.200"
                p="1rem"
              >
                <VStack w="100%">
                  <Button

                    w="100%"
                    maxW="60rem"
                    h={{ sm: "2.5rem", md: "3rem", lg: "4rem" }}
                    borderRadius={"4rem"}
                    borderWidth="2px"
                    borderColor={"red.500"}
                    bg="none"
                    color="red.500"
                    fontSize={{ sm: "lg", lg: "xl" }}
                    transition="all 0.3s"
                    marginTop="0.3rem"
                    _hover={{ transform: "translateY(-3px)" }}
                    onClick={() => handleDeleteStudentsButton()}
                  >
                    Delete ALL Students
                  </Button>

                  <Button

                    w="100%"
                    maxW="60rem"
                    h={{ sm: "2.5rem", md: "3rem", lg: "4rem" }}
                    borderRadius={"4rem"}
                    borderWidth="2px"
                    borderColor={"red.500"}
                    bg="none"
                    color="red.500"
                    fontSize={{ sm: "lg", lg: "xl" }}
                    transition="all 0.3s"
                    marginTop="0.3rem"
                    _hover={{ transform: "translateY(-3px)" }}
                    onClick={() => handleDeleteHomeworkButton()}
                  >
                    Delete ALL Homework
                  </Button>

                  <Button

                    w="100%"
                    maxW="60rem"
                    h={{ sm: "2.5rem", md: "3rem", lg: "4rem" }}
                    borderRadius={"4rem"}
                    borderWidth="2px"
                    borderColor={"red.500"}
                    bg="none"
                    color="red.500"
                    fontSize={{ sm: "lg", lg: "xl" }}
                    transition="all 0.3s"
                    marginTop="0.3rem"
                    _hover={{ transform: "translateY(-3px)" }}
                    onClick={() => handleDeleteExamsButton()}
                  >
                    Delete ALL Exams
                  </Button>
                </VStack>

              </AccordionItemContent>
            </AccordionItem>
          </AccordionRoot>

        </VStack>

      ) : (

        <Box w="100%" h="100%" flex="1" display="flex" justifyContent="center" alignItems="center">
          <Spinner color="green.500" borderWidth="4px" cosize="xl" />
        </Box>
      )}




      <Box w="100%" display="flex" justifyContent="center">
        <HStack
          justifyContent="space-between"
          w="80%"
          h="8rem"
          display={disappearOnMin}
          paddingBottom="2rem"
          paddingTop="2rem"
        >

          <Box onClick={handleBack} p="0.5rem" cursor="pointer">
            <FaArrowLeft size="1.5rem" className='FaArrowLeft' />
          </Box>

          <Box>
            <Button
              borderRadius={"4rem"}
              w={{ "xxs": "4.5rem", "xs": "6rem", sm: "12rem" }}
              borderWidth="2px"
              borderColor={"green.500"}
              bg="none"
              color="green.500"
              fontSize={{ sm: "lg", lg: "xl" }}
              transition="all 0.3s"
              onClick={handleRestoreButton}
              _hover={{ transform: "translateY(-3px)" }}
            >Restore {restoreButtonBreakpoint}</Button>

            <Button
              borderRadius={"4rem"}
              w={{ "xxs": "3.5rem", "xs": "5rem", sm: "6rem" }}
              bg="green.500"
              color="gray.100"
              fontSize={{ sm: "lg", lg: "xl" }}
              transition="all 0.3s"
              _hover={{ transform: "translateY(-3px)" }}
              marginLeft={{ "xxs": "0.5rem", "xs": "1rem", sm: "1.5rem" }}
              onClick={() => handleSaveButton()}
            >Save</Button>
          </Box>
        </HStack>

      </Box>


    </Box>
  )
}

export default Settings