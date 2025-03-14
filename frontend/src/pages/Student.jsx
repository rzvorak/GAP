import Header from '../components/Header'
import { React, useState, useEffect } from 'react'
import { Box, SimpleGrid, useBreakpointValue, Center, VStack, Heading, Spinner } from '@chakra-ui/react'
import '../styles/App.css'

// icon imports
import { FaRegUser } from "react-icons/fa6";
import { GoPencil } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { SlGraph } from "react-icons/sl";
import { MdOutlinePercent } from "react-icons/md";


import { useNavigate, useLocation } from 'react-router-dom';
import { useStudentStore } from '../store/student.js';
import { useHomeworkStore } from '../store/homework.js';
import { useExamStore } from '../store/exam.js'

const Landing = () => {

    const location = useLocation();
    const studentId = location.state?.studentId;

    const { fetchHomeworks, homeworks } = useHomeworkStore()
    const { fetchExams, exams } = useExamStore();
    const { fetchStudents, updateStudent, students } = useStudentStore()

    const [currentStudent, setCurrentStudent] = useState({})

    const [triggerLoad, setTriggerLoad] = useState(false);

    const [settings, setSettings] = useState({})

    const navigate = useNavigate();
    const handleForward = (box) => {
        navigate('/students/student-view/' + box.split(" ")[1].toLowerCase(), {state: {studentId: studentId, currentStudent: currentStudent}});
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
        // TODO: make sure can't nav to comments until loaded
        setCurrentStudent(student);

    }, [triggerLoad]);

    const boxes = ["See Scores", "Create Report", "Student Profile", "Add Comments"]
    const iconSize = useBreakpointValue({ "xxs": "3rem", "xs": "4rem", sm: "5rem", md: "7rem", lg: "9rem" });
    const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "grid" })
    const columns = useBreakpointValue({ "xxs": 1, sm: 2 });

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
        >
            <Header></Header>

            <Box>
                {currentStudent.name}
            </Box>

            <SimpleGrid
                display={disappearOnMin}
                columns={columns}
                w={"full"}
                marginTop={"2rem"}
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
                                    {box === "Add Comments" ? <IoChatbubbleEllipsesOutline size={iconSize} /> : null}
                                    {box === "Create Report" ? <IoDocumentTextOutline size={iconSize} /> : null}
                                    {box === "See Scores" ? <MdOutlinePercent size={iconSize} /> : null}
                                </Box>
                            </VStack>
                        </Box>
                    </Center>
                ))}


            </SimpleGrid>
        </Box>

    )
}

export default Landing