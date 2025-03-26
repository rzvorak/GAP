import React, { useState, useEffect } from 'react'
import { Button, Box, Spinner } from '@chakra-ui/react'
import { IoClose } from "react-icons/io5";

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

import { useStudentStore } from '../store/student';
import { useHomeworkStore } from '../store/homework';
import { useExamStore } from '../store/exam';


const Dialog_Report_Student = (props) => {
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
        height: "18rem",
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
        height: "5rem",
        paddingLeft: "2.5rem",
        paddingTop: "1rem",
        display: "flex",
        alignItems: "center",
        fontSize: "1.2rem",
        justifyContent: "space-between",
        paddingRight: "2.5rem"
    }

    const dialogBody = {
        width: "100%",
        paddingTop: "0.5rem",
        height: "7rem",
        display: "flex",
        flexDirection: "column",
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
        height: "6rem",
        display: "flex",
        justifyContent: 'center',
        alignItems: "center",
    }

    const [cooldown, setCooldown] = useState(false)
    const handleSubmitButton = async () => {
        if (!cooldown) {
            setCooldown(true)
            await createStudentPDF();
            handleExit();
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

    //////////////

    const { fetchStudents, students } = useStudentStore();
    const { fetchHomeworks, homeworks } = useHomeworkStore();
    const { fetchExams, exams } = useExamStore();

    const [currentStudent, setCurrentStudent] = useState(null);

    const [localHomeworks, setLocalHomeworks] = useState([]);
    const [localExams, setLocalExams] = useState([]);

    const [settings, setSettings] = useState({});
    const [subjects, setSubjects] = useState([]);

    const [overallPercent, setOverallPercent] = useState(-1);
    const [homeworkPercent, setHomeworkPercent] = useState(-1);
    const [midtermPercent, setMidtermPercent] = useState(-1);
    const [monthlyPercent, setMonthlyPercent] = useState(-1);
    const [terminalPercent, setTerminalPercent] = useState(-1);

    const [isLoading, setIsLoading] = useState(true)
    const [isExamLoading, setIsExamLoading] = useState(true)
    const [isHomeworkLoading, setIsHomeworkLoading] = useState(true)


    useEffect(() => {
        const fetchSettings = async () => {
            const res = await fetch("/api/settings");
            const data = await res.json();
            setSettings(data.data);
            setSubjects(data.data.subjects);
        };

        fetchStudents()
            .then(() => fetchHomeworks()
                .then(() => fetchExams()
                    .then(() => fetchSettings()
                        .then(() => setIsLoading(false)))))
    }, []);

    useEffect(() => {
        if (isLoading || Object.keys(settings).length === 0) return;

        const student = students.find((student) => student._id === props.studentId);
        setCurrentStudent(student || null);
    }, [students, settings]);

    // Set local exams for student
    useEffect(() => {
        if (isLoading || !currentStudent || !currentStudent.examLog || exams.length === 0) return;

        setLocalExams(exams.filter((exam) => currentStudent.examLog.hasOwnProperty(exam._id)))
        setIsExamLoading(false)
    }, [currentStudent, exams]);

    // Set local homeworks for student
    useEffect(() => {
        if (isLoading || !currentStudent || !currentStudent.homeworkLog || homeworks.length === 0) return;

        setLocalHomeworks(homeworks.filter((homework) => currentStudent.homeworkLog.hasOwnProperty(homework._id)))
        setIsHomeworkLoading(false)
    }, [currentStudent, homeworks]);

    const typeToPercent = { "homework": homeworkPercent, "monthly": monthlyPercent, "midterm": midtermPercent, "terminal": terminalPercent }

    useEffect(() => {
        if (isHomeworkLoading || isExamLoading || !settings.subjects || !settings.distribution) return;

        setHomeworkPercent(localHomeworks.length !== 0 ? (localHomeworks.reduce((sum, homework) => sum += currentStudent.homeworkLog[homework._id], 0) / localHomeworks.reduce((sum, homework) => sum += homework.points, 0) * 100) : -2)

        const monthlyExams = localExams.filter((exam) => { return exam.type === "monthly" })
        const midtermExams = localExams.filter((exam) => { return exam.type === "midterm" })
        const terminalExams = localExams.filter((exam) => { return exam.type === "terminal" })

        setMonthlyPercent(monthlyExams.length !== 0 ? ((monthlyExams.reduce((sum, exam) => sum += Object.values(currentStudent.examLog[exam._id]).reduce((sum, score) => sum + score, 0), 0) / monthlyExams.reduce((sum, exam) => sum += exam.points * subjects[currentStudent.class].length, 0)) * 100) : -2)
        setMidtermPercent(midtermExams.length !== 0 ? ((midtermExams.reduce((sum, exam) => sum += Object.values(currentStudent.examLog[exam._id]).reduce((sum, score) => sum + score, 0), 0) / midtermExams.reduce((sum, exam) => sum += exam.points * subjects[currentStudent.class].length, 0)) * 100) : -2)
        setTerminalPercent(terminalExams.length !== 0 ? ((terminalExams.reduce((sum, exam) => sum += Object.values(currentStudent.examLog[exam._id]).reduce((sum, score) => sum + score, 0), 0) / terminalExams.reduce((sum, exam) => sum += exam.points * subjects[currentStudent.class].length, 0)) * 100) : -2)

    }, [isHomeworkLoading, isExamLoading])

    useEffect(() => {
        if (homeworkPercent == -1 || monthlyPercent == -1 || midtermPercent == -1 || terminalPercent == -1) return;

        // get new total weight based on types that have existing scores to consider
        let totalWeight = Object.keys(settings.distribution).reduce((sum, type) => sum += typeToPercent[type] !== -2 ? settings.distribution[type] : 0, 0)

        if (totalWeight === 0) {
            setOverallPercent(-2)
        } else {
            setOverallPercent(Object.keys(settings.distribution).reduce((sum, type) => sum += typeToPercent[type] !== -2 ? (settings.distribution[type] / totalWeight) * typeToPercent[type] : 0, 0))
        }
    }, [homeworkPercent, monthlyPercent, midtermPercent, terminalPercent])


    const calculateGrade = (percent) => {
        if (percent < 0 || percent === null || isNaN(percent)) return "-"
        let grade = "F";
        if (percent >= settings.cutoffs.A) grade = "A";
        else if (percent >= settings.cutoffs.B) grade = "B";
        else if (percent >= settings.cutoffs.C) grade = "C";
        else if (percent >= settings.cutoffs.D) grade = "D";
        return grade;
    }

    const createStudentPDF = async () => {

        const pdfDoc = await PDFDocument.create();
        pdfDoc.setTitle(currentStudent.name)
        let page = pdfDoc.addPage([595, 842]);

        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // title
        page.drawText(currentStudent.name.length > 30 ? currentStudent.name.slice(0, 30) + "..." : currentStudent.name, {
            x: 25,
            y: 842 - 60,
            size: 30,
            color: rgb(0, 0, 0),
        });

        // corner
        page.drawText("Green Apple Pre & Primary School", {
            x: 595 - 200,
            y: 842 - 20,
            size: 10,
            color: rgb(0, 0, 0),
        });

        // student metadata
        const studentCategories = ["Class:", "Overall:", "Rank:", "Date Created:", "Another:"]
        let varY = 842 - 100
        studentCategories.forEach((category) => {
            page.drawText(category, {
                x: 60,
                y: varY,
                size: 15,
                color: rgb(0, 0, 0),
            })
            varY -= 30
        })

        // line by student metadata
        page.drawLine({
            start: { x: 30, y: 842 - 85 },
            end: { x: 30, y: 842 - 225 },
            thickness: 2,
            color: rgb(0, 0, 0)
        })

        // student metadata values
        const studentCategoryValues = [
            String(currentStudent.class),
            overallPercent.toFixed(1) + "% " + " " + calculateGrade(overallPercent) ,
            "-",
            String(new Date().toISOString().split('T')[0])
        ]
        varY = 842 - 100
        studentCategoryValues.forEach((categoryValue) => {
            page.drawText(categoryValue, {
                x: 180,
                y: varY,
                size: 15,
                color: rgb(0, 0, 0),
            })
            varY -= 30
        })

        // lines by student analysis
        page.drawLine({
            start: { x: 285, y: 842 - 85 },
            end: { x: 595 - 30, y: 842 - 85 },
            thickness: 2,
            color: rgb(0, 0, 0)
        })
        page.drawLine({
            start: { x: 285, y: 842 - 225 },
            end: { x: 595 - 30, y: 842 - 225 },
            thickness: 2,
            color: rgb(0, 0, 0)
        })

        // student analysis
        varY = 842 - 112
        const analysisCategories = [
            ["Homework Grade:", homeworkPercent],
            ["Monthly Exam(s) Grade:", monthlyPercent],
            ["Midterm Exam(s) Grade:", midtermPercent],
            ["Terminal Exam(s) Grade:", terminalPercent]
        ];
        analysisCategories.forEach(category => {
            page.drawText(category[0], {
                x: 290,
                y: varY,
                size: 15,
                color: rgb(0, 0, 0),
            })
            page.drawText(category[1].toFixed(1) + "%", {
                x: 500,
                y: varY,
                size: 15,
                color: rgb(0, 0, 0),
            })
            varY -= 30
        })

        // subject table headers
        let varX = 160
        const subjectCategories = ["Home", "Mon", "Mid", "Ter", "Avg", "Grade", "Rank"];
        subjectCategories.forEach(category => {
            page.drawText(category, {
                x: varX,
                y: 842 - 260,
                size: 15,
                font: boldFont,
                color: rgb(0, 0, 0),
            })
            varX += 60
        })


        // subject ranking logic
        let currentRank = 1;

        setHomeworkPercent(localHomeworks.length !== 0 ? (localHomeworks.reduce((sum, homework) => sum += currentStudent.homeworkLog[homework._id], 0) / localHomeworks.reduce((sum, homework) => sum += homework.points, 0) * 100) : -2)

        // TODO: oh man
        const homeworkPercents = subjects.map(
            subject => [subject, homeworks.filter(
                homework => Object.keys(currentStudent.homeworkLog).includes(homework._id) && homework.subject === subject)
                .reduce((sum, homework) => sum += currentStudent.homeworkLog[homework._id])  ]
        )

        let sortedSubjects = Object.keys(subjectCounts).map(subject => [subject, subjectCounts[subject][0]]).sort((a, b) => b[1] - a[1])
        const subjectRanks = {}
        currentRank = 1;
        for (let i = 0; i < sortedSubjects.length; ++i) {
            let [subject, score] = sortedSubjects[i];

            if (i > 0 && score === sortedSubjects[i - 1][1]) {
                subjectRanks[subject] = subjectRanks[sortedSubjects[i - 1][0]];
            } else {
                subjectRanks[subject] = currentRank
            }
            currentRank++
        }

        // subject table
        varY = 842 - 305
        let lineY = 842 - 280

        settings.subjects[currentStudent.class].forEach((subject, index) => {
            let subjectStats = [
                subject
            ]

            page.drawLine({
                start: { x: 30, y: lineY },
                end: { x: 595 - 30, y: lineY },
                thickness: 2,
                color: rgb(0, 0, 0)
            })
            lineY -= 40

            varX = 30
            subjectStats.forEach((stat, statIndex) => {
                page.drawText(stat, {
                    x: varX,
                    y: varY,
                    size: 15,
                    color: rgb(0, 0, 0),
                })
                varX += 40
            })
            varY -= 40
        })



        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        saveAs(blob, `${currentStudent.name}.pdf`);  // Triggers the file download
    }

    return (
        <div style={dialogContainer}>
            <div style={dialog}>
                <div style={dialogHeader}>
                    <h1>Create Report</h1>
                    <div onClick={() => handleExit()}>
                        <IoClose size="2rem" className="IoClose" />
                    </div>
                </div>



                <div style={dialogFooter}>
                    {!cooldown && currentStudent ? (
                        <Button
                            w="60%"
                            h="2.5rem"
                            borderRadius={"4rem"}
                            borderWidth="2px"
                            color="gray.100"
                            fontSize="lg"
                            transition="all 0.3s"
                            bg="green.500"
                            cursor="pointer"
                            _hover={{ bg: "green.600" }}
                            onClick={handleSubmitButton}
                        >Download PDF</Button>
                    ) : (
                        <Box w="100%" display="flex" alignItems="center" justifyContent="center">
                            <Spinner color="green.500" borderWidth="4px" cosize="xl" />
                        </Box>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dialog_Report_Student