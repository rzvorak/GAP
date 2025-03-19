import { React, useState, useEffect } from 'react'
import { Box, VStack, Heading, useBreakpointValue, Spinner, Center, Text, SimpleGrid, HStack } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa';

import { useStudentStore } from '../store/student.js';
import { useHomeworkStore } from '../store/homework.js';
import { useExamStore } from '../store/exam.js'

import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from '../components/ui/accordion'


// TODO: fix weird load issue 
const Student_Scores = () => {
  const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })

  const location = useLocation();
  const studentId = location.state?.studentId;

  const { fetchStudents, students } = useStudentStore();
  const { fetchHomeworks, homeworks } = useHomeworkStore();
  const { fetchExams, exams } = useExamStore();

  const [currentStudent, setCurrentStudent] = useState({});

  const [localHomeworks, setLocalHomeworks] = useState([])
  const [isHomeworkLoading, setIsHomeworkLoading] = useState(true)

  const [localExams, setLocalExams] = useState([])
  const [isExamLoading, setIsExamLoading] = useState(true)

  const [settings, setSettings] = useState({})
  const [subjects, setSubjects] = useState({})

  const [overallPercent, setOverallPercent] = useState(-1);
  const [homeworkPercent, setHomeworkPercent] = useState(-1);
  const [midtermPercent, setMidtermPercent] = useState(-1);
  const [monthlyPercent, setMonthlyPercent] = useState(-1);
  const [terminalPercent, setTerminalPercent] = useState(-1);


  useEffect(() => {
    fetchStudents()
  }, [fetchStudents]);

  useEffect(() => {
    fetchExams()
  }, [fetchExams]);

  useEffect(() => {
    fetchHomeworks()
  }, [fetchHomeworks]);

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data.data)
      setSubjects(data.data.subjects)
    }
    fetchSettings();
  }, [])

  useEffect(() => {
    if (!studentId || students.length === 0 || Object.keys(settings).length === 0) return;

    const student = students.find(student => student._id === studentId);

    setCurrentStudent(student);
  }, [students]);

  useEffect(() => {
    if (!currentStudent || !currentStudent.examLog) return;
    setLocalExams(exams.filter((exam) => { return Object.keys(currentStudent.examLog).includes(exam._id) }));
    setIsExamLoading(false)
  }, [exams]);

  useEffect(() => {
    if (!currentStudent || !currentStudent.homeworkLog) return;
    setLocalHomeworks(homeworks.filter((homework) => { return Object.keys(currentStudent.homeworkLog).includes(homework._id) }));
    setIsHomeworkLoading(false)
  }, [homeworks]);

  const typeToPercent = { "homework": homeworkPercent, "monthly": monthlyPercent, "midterm": midtermPercent, "terminal": terminalPercent }

  useEffect(() => {
    if (isHomeworkLoading || isExamLoading || !settings.subjects) return;

    setHomeworkPercent(localHomeworks.length !== 0 ? (localHomeworks.reduce((sum, homework) => sum += currentStudent.homeworkLog[homework._id], 0) / localHomeworks.reduce((sum, homework) => sum += homework.points, 0) * 100) : -2)

    const monthlyExams = localExams.filter((exam) => { return exam.type === "monthly" })
    const midtermExams = localExams.filter((exam) => { return exam.type === "midterm" })
    const terminalExams = localExams.filter((exam) => { return exam.type === "terminal" })

    setMonthlyPercent(monthlyExams.length !== 0 ? ((monthlyExams.reduce((sum, exam) => sum += Object.values(currentStudent.examLog[exam._id]).reduce((sum, score) => sum + score, 0), 0) / monthlyExams.reduce((sum, exam) => sum += exam.points * subjects[currentStudent.class].length, 0)) * 100) : -2)
    setMidtermPercent(midtermExams.length !== 0 ? ((midtermExams.reduce((sum, exam) => sum += Object.values(currentStudent.examLog[exam._id]).reduce((sum, score) => sum + score, 0), 0) / midtermExams.reduce((sum, exam) => sum += exam.points * subjects[currentStudent.class].length, 0)) * 100) : -2)
    setTerminalPercent(terminalExams.length !== 0 ? ((terminalExams.reduce((sum, exam) => sum += Object.values(currentStudent.examLog[exam._id]).reduce((sum, score) => sum + score, 0), 0) / terminalExams.reduce((sum, exam) => sum += exam.points * subjects[currentStudent.class].length, 0)) * 100) : -2)

    // get new total weight based on types that have existing scores to consider
    let totalWeight = Object.keys(settings.distribution).reduce((sum, type) => sum += typeToPercent[type] !== -2 ? settings.distribution[type] : 0, 0)


    if (totalWeight === 0) {
      setOverallPercent(-2)
    } else {
      setOverallPercent(Object.keys(settings.distribution).reduce((sum, type) => sum += typeToPercent[type] !== -2 ? (settings.distribution[type] / totalWeight) * typeToPercent[type] : 0, 0))
    }

  })

  const examGridColumns = useBreakpointValue({ "xxs": 2, sm: 3, md: 4, lg: 6, xl: 7 })

  const calculateGrade = (percent) => {
    if (percent < 0) return "-"
    let grade = "F";
    if (percent >= settings.cutoffs.A) grade = "A";
    else if (percent >= settings.cutoffs.B) grade = "B";
    else if (percent >= settings.cutoffs.C) grade = "C";
    else if (percent >= settings.cutoffs.D) grade = "D";
    return grade;
  }


  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/students/student-view', { state: { studentId: studentId } })
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

      <VStack
        flex="1"
        display={disappearOnMin}
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
          >Student Scores</Heading>
        </Box>

        {(overallPercent !== -1) ? (
          <Box
            w="80%"
            maxW="40rem"
          >
            <Box
              borderRadius="1.2rem"
              paddingLeft="1rem"
              display={disappearOnMin}
              flexDir="column"
              bg="gray.200">
              <Box display="flex" flexDir="row" justifyContent="space-between">
                <Text lineClamp="1" marginRight="1rem" marginTop="1rem">Overall Grade: {overallPercent !== -2 ? overallPercent.toFixed(1) + "%" : "-"}</Text>
                <Text fontWeight="bold" lineClamp="1" marginRight="2rem" marginTop="1rem">{calculateGrade(overallPercent)}</Text>
              </Box>
              {Object.keys(typeToPercent).map((type, index) => (
                <Box key={index} display="flex" flexDir="row" justifyContent="space-between">
                  <Text lineClamp="1" marginRight="1rem" marginTop="1rem">{type.charAt(0).toUpperCase() + type.slice(1)} Grade: {typeToPercent[type] !== -2 ? typeToPercent[type].toFixed(1) + "%" : "-"}</Text>
                  <Text mb={type === "terminal" ? "1rem" : "0rem"} fontWeight="bold" lineClamp="1" marginRight="2rem" marginTop="1rem">{calculateGrade(typeToPercent[type])}</Text>
                </Box>
              ))}


            </Box>
          </Box>
        ) : (

          <Box marginBottom="2rem">
            <Spinner color="green.500" borderWidth="4px" cosize="xl" />
          </Box>
        )}


        <Box
          w="80%"
          h={{ sm: "3rem" }}
          display="flex"
          alignItems={"center"}>
          <Heading
            color="gray.600"
            fontSize="xl"
            fontWeight={"400"}
          >Homework</Heading>
        </Box>

        {(!isHomeworkLoading) ? (localHomeworks.length !== 0 ? (
          <AccordionRoot
            w="80%"

            variant={"plain"}
            collapsible
            multiple
            borderRadius="0"
          >
            {localHomeworks.map((homework, index) => (
              <AccordionItem
                borderRadius="0"
                bg="gray.200"
                marginBottom="1rem"
                key={index}
                value={homework.name}>
                <AccordionItemTrigger
                  p="0.75rem"
                  cursor="pointer"
                  h="3.5rem"
                  bg="gray.100"
                  fontWeight="400"
                  display="flex"
                  style={{ boxShadow: 'var(--box-shadow-classic)' }}
                >
                  <Text
                    position="absolute"
                    lineClamp="1"
                    maxWidth={{ "xxs": "10%", "xs": "40%", sm: "50%" }}
                  >{homework.name}</Text>

                  <HStack
                    right="15%"
                    position="absolute"
                    marginRight="1rem">
                    <Box
                      fontSize="sm"
                      bg="gray.200"
                      p="0.5rem"
                      borderRadius="0.7rem"
                    >{homework.subject.slice(0, 2)}</Box>


                    <Box
                      w="4rem"
                      fontSize="sm"
                      p="0.5rem"
                    >{((currentStudent.homeworkLog[homework._id] / homework.points) * 100).toFixed(1)}%  {currentStudent.homeworkLog[homework._id]}/{homework.points}</Box>

                    <Box
                      fontWeight="bold"
                      w="2rem"
                      fontSize="sm"
                      p="0.5rem">
                      {calculateGrade((currentStudent.homeworkLog[homework._id] / homework.points) * 100)}
                    </Box>

                  </HStack>

                </AccordionItemTrigger>
                <AccordionItemContent
                  bg="gray.200"
                  p="0.5rem"
                >
                  <Box display="flex" flexDir="column" position="relative" >
                    <Box>
                      <Text lineClamp="1" fontSize="sm" p="0.4rem">Subject:  {homework.subject} </Text>
                      <Text lineClamp="1" fontSize="sm" p="0.4rem">Class Mean Grade:  {homework.meanGrade == -1 || homework.meanGrade == null ? "Not yet scored" : (((homework.meanGrade / homework.points) * 100).toFixed(1) + "%   ,  " + homework.meanGrade.toFixed(2) + " / " + homework.points)} </Text>
                      <Text lineClamp="1" fontSize="sm" p="0.4rem">Date Created: {String(homework.createdAt).slice(0, 10)}</Text>
                    </Box>
                  </Box>

                </AccordionItemContent>
              </AccordionItem>
            ))}
          </AccordionRoot>

        ) :
          <Box
            w="80%"
            h="4rem"
            bg="gray.200"
            display="flex"
            alignItems="center"
            justifyContent="center">
            No Homework Found
          </Box>

        ) : (
          <Box marginBottom="2rem">
            <Spinner color="green.500" borderWidth="4px" cosize="xl" />
          </Box>

        )}

        <Box
          w="80%"
          h={{ sm: "3rem" }}
          display="flex"
          alignItems={"center"}>
          <Heading
            color="gray.600"
            fontSize="xl"
            fontWeight={"400"}
          >Exams</Heading>
        </Box>

        {(!isExamLoading) ? (localExams.length !== 0 ? (
          <AccordionRoot
            w="80%"
            variant={"plain"}
            collapsible
            multiple
            borderRadius="0"
          >
            {localExams.map((exam, index) => (
              <AccordionItem
                borderRadius="0"
                bg="gray.200"
                marginBottom="1rem"
                key={index}
                value={exam.type}>
                <AccordionItemTrigger
                  p="0.75rem"
                  cursor="pointer"
                  h="3.5rem"
                  bg="gray.100"
                  fontWeight="400"
                  display="flex"
                  style={{ boxShadow: 'var(--box-shadow-classic)' }}
                >
                  <Text
                    position="absolute"
                    lineClamp="1"
                    maxWidth={{ "xxs": "30%", "xs": "40%", sm: "50%" }}
                  >{exam.type.charAt(0).toUpperCase()}{exam.type.slice(1)} Exam</Text>

                  <HStack
                    right="15%"
                    position="absolute"
                    marginRight="1rem">
                    <Box
                      fontSize="sm"
                      bg="gray.200"
                      p="0.5rem"
                      borderRadius="0.7rem"
                    >{exam.month}</Box>

                    { }
                    <Box
                      w="4rem"
                      fontSize="sm"
                      p="0.5rem"
                      borderRadius="0.7rem"
                    >{(((Object.values(currentStudent.examLog[exam._id]).reduce((sum, num) => sum + num, 0) / Object.values(currentStudent.examLog[exam._id]).length) / exam.points) * 100).toFixed(1)}%</Box>

                    <Box
                      fontWeight="bold"
                      w="2rem"
                      fontSize="sm"
                      p="0.5rem">
                      {calculateGrade((((Object.values(currentStudent.examLog[exam._id]).reduce((sum, num) => sum + num, 0) / Object.values(currentStudent.examLog[exam._id]).length) / exam.points) * 100))}
                    </Box>

                  </HStack>

                </AccordionItemTrigger>
                <AccordionItemContent
                  bg="gray.200"
                  p="0.5rem"
                >
                  <Box display="flex" flexDir="column" position="relative" >

                    <SimpleGrid
                      columns={examGridColumns}
                      pb="1rem"
                    >

                      {subjects[exam.class].map((subject, index) => (
                        <VStack key={index} ml="0.5rem" mr="0.5rem" mb="0.5rem">
                          <Text fontSize="sm" fontWeight="bold" pt="0.5rem" truncate maxW={{ "xxs": "3rem", "xs": "6rem", sm: "8rem", }} >{subject}</Text>
                          <Text>{((currentStudent.examLog[exam._id][subject] / exam.points) * 100).toFixed(1)}%  {currentStudent.examLog[exam._id][subject]}/{exam.points}</Text>

                        </VStack>

                      ))}

                    </SimpleGrid>

                    <Box>
                      <Text lineClamp="1" fontSize="sm" p="0.4rem">Class Mean Grade:  {exam.meanGrade == -1 || exam.meanGrade == null ? "Not yet scored" : (((exam.meanGrade / (subjects[exam.class].length * exam.points)) * 100).toFixed(1) + "%")}</Text>
                      <Text lineClamp="1" fontSize="sm" p="0.4rem">Date Created: {String(exam.createdAt).slice(0, 10)}</Text>
                    </Box>

                  </Box>

                </AccordionItemContent>
              </AccordionItem>
            ))}
          </AccordionRoot>

        ) :

          <Box
            w="80%"
            h="4rem"
            bg="gray.200"
            display="flex"
            alignItems="center"
            justifyContent="center">
            No Exams Found
          </Box>

        ) : (
          <Box marginBottom="2rem">
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

export default Student_Scores