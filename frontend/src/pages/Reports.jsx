import React, { useEffect, useState } from 'react'
import { Box, VStack, Heading, useBreakpointValue, Button, Spinner } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa';

import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

import { useStudentStore } from '../store/student.js';
import { useHomeworkStore } from '../store/homework.js';
import { useExamStore } from '../store/exam.js'

import Dialog_Report_Homework from '../components/Dialog_Report_Homework';
import Dialog_Report_Class from '../components/Dialog_Report_Class';
import Dialog_Report_Exam from '../components/Dialog_Report_Exam';


const Reports = () => {
  const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })

  const { fetchStudents, students } = useStudentStore();
  const { fetchHomeworks, homeworks } = useHomeworkStore();
  const { fetchExams, exams } = useExamStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudents().then(() => fetchHomeworks().then(() => fetchExams().then(setIsLoading(false))))
  }, [])

  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/landing')
  }

  const navigateToStudents = () => {
    console.log('test')
    navigate('/students')
  }


  const createHomeworkPDF = async (id) => {

    const currentHomework = homeworks.find((homework) => homework._id === id)

    console.log("beginning pdf")
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    page.drawText(currentHomework.name, {
      x: 50,
      y: 350,
      size: 20,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    saveAs(blob, 'document.pdf');  // Triggers the file download

  }

  const createExamPDF = async (id) => {
    const currentExam = exams.find((exam) => exam._id === id)

    console.log("beginning pdf")
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    page.drawText(currentExam.name, {
      x: 50,
      y: 350,
      size: 20,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    saveAs(blob, 'document.pdf');  // Triggers the file download
  }

  const [homeworkDialog, setHomeworkDialog] = useState(false)
  const handleHomework = () => {
    setHomeworkDialog(!homeworkDialog)
  }

  const [classDialog, setClassDialog] = useState(false)
  const handleClass = () => {
    setClassDialog(!classDialog)
  }

  const [examDialog, setExamDialog] = useState(false)
  const handleExam = () => {
    setExamDialog(!examDialog)
  }

  const options = {
    "By Student": navigateToStudents,
    "By Class": handleClass,
    "For Homework": handleHomework,
    "For Exam": handleExam
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

      {homeworkDialog && <Dialog_Report_Homework createHomeworkPDF={createHomeworkPDF} homeworks={homeworks} setDialog={handleHomework}></Dialog_Report_Homework>}
      {classDialog && <Dialog_Report_Class setDialog={handleClass}></Dialog_Report_Class>}
      {examDialog && <Dialog_Report_Exam createExamPDF={createExamPDF} exams={exams} setDialog={handleExam}></Dialog_Report_Exam>}

      <VStack
        display={disappearOnMin}
        flexDir="column"
        flex="1"
        w="100%">

        {!isLoading ? (

          <>
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
              >Generate a Report</Heading>
            </Box>

            <VStack w="100%" flex="1">

              {Object.keys(options).map((option, index) => (
                <Button
                  key={index}
                  w="80%"
                  maxW="60rem"
                  h={{ sm: "2.5rem", md: "3rem", lg: "4rem" }}
                  borderRadius={"4rem"}
                  borderWidth="2px"
                  borderColor={"green.500"}
                  bg={(option === "By Student" ? "none" : "green.500")}
                  color={(option === "By Student" ? "green.500" : "gray.100")}
                  fontSize={{ sm: "lg", lg: "xl" }}
                  transition="all 0.3s"
                  marginTop="0.3rem"
                  _hover={{ transform: "translateY(-3px)" }}
                  onClick={options[option]}
                >
                  {option}
                </Button>

              ))}

            </VStack>
          </>

        ) : (

          <Box w="100%" h="100%" flex="1" display="flex" justifyContent="center" alignItems="center">
            <Spinner color="green.500" borderWidth="4px" cosize="xl" />
          </Box>
        )}
      </VStack>

      <Box
        w="100%"
        display={disappearOnMin}
        h="8rem"
        paddingTop="2rem"
        paddingBottom="2rem"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          cursor={"pointer"}
          onClick={handleBack}>
          <FaArrowLeft size="1.5rem" className='FaArrowLeft' />
        </Box>
      </Box>

    </Box>
  )
}

export default Reports