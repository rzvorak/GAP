import Header from '../components/Header'
import { React, useState, useEffect } from 'react'
import { Box, SimpleGrid, useBreakpointValue, Center, VStack, Heading, Spinner, Text, HStack } from '@chakra-ui/react'

// icon imports
import { FaRegUser } from "react-icons/fa6";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdOutlinePercent } from "react-icons/md";
import { FaArrowLeft } from 'react-icons/fa';

import { useNavigate, useLocation } from 'react-router-dom';
import { useStudentStore } from '../store/student.js';
import { useHomeworkStore } from '../store/homework.js';
import { useExamStore } from '../store/exam.js'

import Dialog_Report_Student from '../components/Dialog_Report_Student';


const Student = () => {

    const role = localStorage.getItem("role")

    const location = useLocation();
    const studentId = location.state?.studentId;

    const { fetchHomeworks, homeworks } = useHomeworkStore()
    const { fetchExams, exams } = useExamStore();
    const { fetchStudents, students } = useStudentStore()

    const [currentStudent, setCurrentStudent] = useState({})

    const [triggerLoad, setTriggerLoad] = useState(false);

    const [settings, setSettings] = useState({})

    const navigate = useNavigate();
    const [reportDialog, setReportDialog] = useState(false)
    const handleForward = (box) => {
        if (box === "Create Report") {
            setReportDialog(!reportDialog)
        } else {
            navigate('/students/student-view/' + box.split(" ")[1].toLowerCase(), { state: { studentId: studentId, currentStudent: currentStudent } });
        }
    }

    const handleBack = () => {
        navigate('/students')
    }

    // launch once on load, get students, homeworks, and settings
    useEffect(() => {
        async function fetchAll() {
            console.log("Fetching settings, homeworks, and students...");
            const res = await fetch("/api/settings");
            const data = await res.json();
            setSettings(data.data);

            await fetchStudents();
            await fetchExams();
            await fetchHomeworks();
            setTriggerLoad(true);
        }

        fetchAll();
    }, []);

    // wait for students, homework, and settings then execute
    useEffect(() => {
        if (!studentId || !settings.cutoffs || homeworks.length === 0 || students.length === 0 || exams.length === 0) return;

        console.log("Processing students and homeworks...");

        const student = students.find(student => student._id === studentId);
        setCurrentStudent(student);
    }, [triggerLoad]);


    const boxes = ["See Scores", "Create Report", "Student Profile", role !== "student" ? "Add Comments" : "View Comments"]
    const iconSize = useBreakpointValue({ "xxs": "3rem", "xs": "4rem", sm: "5rem", md: "7rem", lg: "9rem" });
    const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })
    const disappearOnMinGrid = useBreakpointValue({ "min": "none", "xxs": "grid" })
    const columns = useBreakpointValue({ "xxs": 1, sm: 2 });
    const classPosition = useBreakpointValue({ "xxs": "space-between", sm: "flex-start" })

    if (!currentStudent.name) {
        return (
            <Center minH="100vh" bg="gray.100">
                <Spinner color="green.500" borderWidth="4px" cosize="xl" />
            </Center>
        );
    }

    return (

        <Box
            minH={"100vh"}
            maxW={"100vw"}
            bg={"gray.100"}
            color="gray.900"
            display="flex"
            flexDir="column"
        >
            {reportDialog && <Dialog_Report_Student setDialog={setReportDialog} studentId={currentStudent._id}></Dialog_Report_Student>}
            <Header></Header>

            <HStack
                w="100%"
                paddingTop="1rem"
                paddingBottom="1rem"
                height="4rem"
                alignItems={"center"}
                display={disappearOnMin}
                flexDir={"row"}
                justifyContent={classPosition}
            >

                <Heading
                    marginLeft="1rem"
                    color="gray.600"
                    fontSize="2xl"
                    fontWeight={"400"}
                >{currentStudent.name}</Heading>

                <Box
                    mr="10%"
                    ml="1rem"
                    mt="0.4rem"
                    bg="gray.200"
                    borderRadius="0.7rem"
                    p="0.5rem"
                >
                    Class {currentStudent.class}
                </Box>
            </HStack>


            <VStack flex="1">


                <SimpleGrid
                    display={disappearOnMinGrid}
                    columns={columns}
                    w={"full"}
                    marginTop={"1rem"}
                >

                    {boxes.map((box, index) => (
                        <Center key={index}>
                            <Box
                                h={{ "xxs": "8rem", "xs": "10rem", sm: "14rem", md: "16rem", lg: "17rem", xl: "17rem" }}
                                w={{ "xxs": "12rem", "xs": "18rem", sm: "14rem", md: "23rem", lg: "29rem", xl: "38rem" }}
                                bg="gray.100"
                                marginBottom="2rem"
                                borderRadius={"1.25rem"}
                                display="flex"
                                flexDirection={"column"}
                                style={{ boxShadow: 'var(--box-shadow-classic)' }}
                                onClick={() => handleForward(box)}
                                transition="all 0.3s"
                                _hover={{ cursor: 'pointer', transform: "translateY(-5px)" }}
                            >
                                <VStack h="100%" >
                                    <Heading
                                        color="gray.600"
                                        fontWeight="400"
                                        marginTop={{ "xxs": "0.75rem", "xs": "1rem", sm: "1.5rem", md: "2rem", lg: "2rem" }}
                                        marginBottom={{ "xxs": "0.5rem", "xs": "1rem", sm: "1.5rem", md: "1.5rem", lg: "2rem" }}
                                        fontSize={{ sm: "lg", md: "2xl", lg: "3xl" }}
                                    >{box}</Heading>
                                    <Box color="green.500">
                                        {box === "Student Profile" ? <FaRegUser size={iconSize} /> : null}
                                        {box.split(" ")[1] === "Comments" ? <IoChatbubbleEllipsesOutline size={iconSize} /> : null}
                                        {box === "Create Report" ? <IoDocumentTextOutline size={iconSize} /> : null}
                                        {box === "See Scores" ? <MdOutlinePercent size={iconSize} /> : null}
                                    </Box>
                                </VStack>
                            </Box>
                        </Center>
                    ))}


                </SimpleGrid>



            </VStack>

            {role !== "student" ? (
                <Box
                    w="100%"
                    display={disappearOnMin}
                    h="6rem"
                    paddingTop="1rem" // control how close plus can get
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
            ) : (null)}

        </Box>

    )
}

export default Student