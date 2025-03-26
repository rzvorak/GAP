import React, { useEffect, useState } from 'react'
import { Box, VStack, Heading, useBreakpointValue, Button, Spinner } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

import { useStudentStore } from '../store/student.js';
import { useHomeworkStore } from '../store/homework.js';
import { useExamStore } from '../store/exam.js'

import Dialog_Report_Homework from '../components/Dialog_Report_Homework';
import Dialog_Report_Class from '../components/Dialog_Report_Class';
import Dialog_Report_Exam from '../components/Dialog_Report_Exam';

// TODO: add little tags in corner for multiple pages understanding
const Reports = () => {
  const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })

  const { fetchStudents, students } = useStudentStore();
  const { fetchHomeworks, homeworks } = useHomeworkStore();
  const { fetchExams, exams } = useExamStore();

  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({})

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch('/api/settings')
      const data = await res.json();
      setSettings(data.data)
    }
    fetchStudents().then(() => fetchHomeworks().then(() => fetchExams().then(() => fetchSettings().then(setIsLoading(false)))))
  }, [])

  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/landing')
  }

  const navigateToStudents = () => {
    console.log('test')
    navigate('/students')
  }

  const calculateGrade = (percent) => {
    console.log(percent)
    if (percent < 0 || percent === null || isNaN(percent)) return "-"
    let grade = "F";
    if (percent >= settings.cutoffs.A) grade = "A";
    else if (percent >= settings.cutoffs.B) grade = "B";
    else if (percent >= settings.cutoffs.C) grade = "C";
    else if (percent >= settings.cutoffs.D) grade = "D";
    return grade;
  }


  const createHomeworkPDF = async (id) => {

    const currentHomework = homeworks.find((homework) => homework._id === id)
    let currentStudents = students.filter((student) => { return Object.keys(student.homeworkLog).includes(currentHomework._id) })

    const pdfDoc = await PDFDocument.create();
    pdfDoc.setTitle(currentHomework.name)
    let page = pdfDoc.addPage([595, 842]);

    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // title
    page.drawText(currentHomework.name.length > 30 ? currentHomework.name.slice(0, 30) + "..." : currentHomework.name, {
      x: 25,
      y: 842 - 60,
      size: 30,
      color: rgb(0, 0, 0),
    });

    // corner
    page.drawText("Green Apple Pre & Primary School " + currentHomework.createdAt.slice(0, 4), {
      x: 595 - 200,
      y: 842 - 20,
      size: 10,
      color: rgb(0, 0, 0),
    });

    // homework metadata
    const homeworkCategories = ["Class:", "Subject:", "Points:", "Date Scored:", "Date Created:"]
    let varY = 842 - 100
    homeworkCategories.forEach((category) => {
      page.drawText(category, {
        x: 60,
        y: varY,
        size: 15,
        color: rgb(0, 0, 0),
      })
      varY -= 30
    })

    // line by homework metadata
    page.drawLine({
      start: { x: 30, y: 842 - 85 },
      end: { x: 30, y: 842 - 225 },
      thickness: 2,
      color: rgb(0, 0, 0)
    })

    // homework metadata values
    const homeworkCategoryValues = [
      String(currentHomework.class),
      currentHomework.subject,
      String(currentHomework.points),
      (currentHomework.meanGrade != -1 ? currentHomework.updatedAt.slice(0, 10) : "-"),
      currentHomework.createdAt.slice(0, 10)
    ]
    varY = 842 - 100
    homeworkCategoryValues.forEach((categoryValue) => {
      page.drawText(categoryValue, {
        x: 180,
        y: varY,
        size: 15,
        color: rgb(0, 0, 0),
      })
      varY -= 30
    })

    let varX = 30
    const studentCategories = ["Name", "Score", "Percent", "Grade", "Rank"];
    studentCategories.forEach(category => {
      page.drawText(category, {
        x: varX,
        y: 842 - 260,
        size: 15,
        font: boldFont,
        color: rgb(0, 0, 0),
      })
      varX += category === "Name" ? 250 : 85
    })

    // lines by homework analysis
    page.drawLine({
      start: { x: 285, y: 842 - 85 },
      end: { x: 595 - 30, y: 842 - 85 },
      thickness: 2,
      color: rgb(0, 0, 0)
    })
    page.drawLine({
      start: { x: 285, y: 842 - 130 },
      end: { x: 595 - 30, y: 842 - 130 },
      thickness: 2,
      color: rgb(0, 0, 0)
    })
    page.drawLine({
      start: { x: 285, y: 842 - 225 },
      end: { x: 595 - 30, y: 842 - 225 },
      thickness: 2,
      color: rgb(0, 0, 0)
    })


    // student ranking logic
    let currentRank = 1;
    const studentRanks = {};
    const studentScores = currentStudents.map((student) => [student._id, student.homeworkLog[currentHomework._id]])
    let gradeCounts = {
      "A": 0,
      "B": 0,
      "C": 0,
      "D": 0,
      "F": 0,
      "Total": 0
    }

    let sortedScores = studentScores.sort((a, b) => b[1] - a[1])

    for (let i = 0; i < sortedScores.length; ++i) {
      let [id, score] = sortedScores[i];

      ++gradeCounts[calculateGrade((score / currentHomework.points) * 100)]
      ++gradeCounts["Total"]

      if (i > 0 && score === sortedScores[i - 1][1]) {
        studentRanks[id] = studentRanks[sortedScores[i - 1][0]];
      } else {
        studentRanks[id] = currentRank;
      }

      currentRank++;
    }

    // sort by rank then sort alphabetically
    currentStudents = currentStudents.sort((a, b) => {
      if (studentRanks[a._id] !== studentRanks[b._id]) {
        return studentRanks[a._id] - studentRanks[b._id];
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      return 0;
    })


    // homework analysis
    varX = 290
    const meanPercent = ((currentHomework.meanGrade / currentHomework.points) * 100).toFixed(1)
    const analysisCategories = [
      "Class Mean:",
      (currentHomework.meanGrade != -1 ? currentHomework.meanGrade.toFixed(1) + "/" + currentHomework.points : "-"),
      (currentHomework.meanGrade != -1 ? meanPercent + "%" : "-"),
      calculateGrade(meanPercent)
    ];
    analysisCategories.forEach(category => {
      page.drawText(category, {
        x: varX,
        y: 842 - 112,
        size: 15,
        color: rgb(0, 0, 0),
      })
      varX += category === "Class Mean:" ? 140 : 60
    })


    // grade distribution
    varX = 290
    let varXAnalysis = 290
    Object.keys(gradeCounts).forEach((grade, index) => {
      page.drawText(grade, {
        x: varX,
        y: 842 - 160,
        size: 15,
        color: rgb(0, 0, 0),
      })
      page.drawText(String(gradeCounts[grade]), {
        x: varXAnalysis,
        y: 842 - 200,
        size: 15,
        color: rgb(0, 0, 0),
      })
      varX += 45
      varXAnalysis += index == 4 ? 52 : 45
    })

    if (currentStudents.length == 0) {
      page.drawText("Not Yet Scored", {
        x: 250,
        y: 842 - 320,
        size: 15,
        color: rgb(0, 0, 0),
      })
    }

    // student table
    varY = 842 - 305
    let lineY = 842 - 280
    currentStudents.forEach((student, index) => {
      let percent = ((student.homeworkLog[currentHomework._id] / currentHomework.points) * 100).toFixed(1)
      let studentStats = [
        student.name,
        student.homeworkLog[currentHomework._id] + "/" + currentHomework.points,
        percent + "%",
        calculateGrade(percent),
        String(studentRanks[student._id])
      ]

      page.drawLine({
        start: { x: 30, y: lineY },
        end: { x: 595 - 30, y: lineY },
        thickness: 2,
        color: rgb(0, 0, 0)
      })
      lineY -= 40

      varX = 30
      studentStats.forEach((stat, index) => {
        page.drawText(stat, {
          x: varX,
          y: varY,
          size: 15,
          color: rgb(0, 0, 0),
        })
        varX += index === 0 ? 255 : 85
      })
      varY -= 40

      // account for page wrap
      if ((index - 12) % 19 == 0) {
        page = pdfDoc.addPage([595, 842]);
        // corner
        page.drawText("Green Apple Pre & Primary School " + currentHomework.createdAt.slice(0, 4), {
          x: 595 - 200,
          y: 842 - 20,
          size: 10,
          color: rgb(0, 0, 0),
        });
        varY = 842 - 65;
        lineY = 842 - 40;
      }
    })


    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    saveAs(blob, `${"Class" + currentHomework.class + "_" + currentHomework.name + "_" + currentHomework.createdAt.slice(0,4)}.pdf`);  // Triggers the file download

  }


  // TODO: cutoff subjects at certain length, ensure subjects fit in exam table
  const createExamPDF = async (id) => {

    const currentExam = exams.find((exam) => exam._id === id)
    let currentStudents = students.filter((student) => { return Object.keys(student.examLog).includes(currentExam._id) })
    const subjects = settings.subjects[currentExam.class]


    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([842, 595]);

    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);


    // title
    page.drawText(currentExam.type.charAt(0).toUpperCase() + currentExam.type.slice(1) + " Exam - " + currentExam.month + " " + currentExam.createdAt.slice(0, 4), {
      x: 25,
      y: 595 - 60,
      size: 30,
      color: rgb(0, 0, 0),
    });

    // corner
    page.drawText("Green Apple Pre & Primary School: " + currentExam.type.charAt(0).toUpperCase() + currentExam.type.slice(1) + " Exam - " + currentExam.month + " " + currentExam.createdAt.slice(0, 4), {
      x: 842 - 300,
      y: 595 - 20,
      size: 10,
      color: rgb(0, 0, 0),
    });

    // exam metadata
    const examCategories = ["Class:", "Points:", "Exam Scored:", "Exam Created:"]
    let varY = 595 - 100
    examCategories.forEach((category) => {
      page.drawText(category, {
        x: 60,
        y: varY,
        size: 15,
        color: rgb(0, 0, 0),
      })
      varY -= 30
    })

    // line by exam metadata
    page.drawLine({
      start: { x: 30, y: 595 - 85 },
      end: { x: 30, y: 595 - 195 },
      thickness: 2,
      color: rgb(0, 0, 0)
    })

    // exam metadata values
    const examCategoryValues = [
      String(currentExam.class),
      String(currentExam.points),
      (currentExam.meanGrade != -1 && currentExam.meanGrade != null ? currentExam.updatedAt.slice(0, 10) : "-"),
      currentExam.createdAt.slice(0, 10)
    ]
    varY = 595 - 100
    examCategoryValues.forEach((categoryValue) => {
      page.drawText(categoryValue, {
        x: 180,
        y: varY,
        size: 15,
        color: rgb(0, 0, 0),
      })
      varY -= 30
    })


    // student ranking logic
    let currentRank = 1;
    const studentRanks = {};
    const studentScoreTotals = currentStudents.map((student => [student._id, Object.values(student.examLog[currentExam._id]).reduce((sum, acc) => sum += acc, 0)]))

    let subjectCounts = subjects.reduce((acc, subject) => {
      acc[subject] = [0, { "A": 0, "B": 0, "C": 0, "D": 0, "F": 0 }];
      return acc;
    }, {});

    currentStudents.forEach(student => {
      Object.keys(student.examLog[currentExam._id]).forEach((subject) => {
        // accumulate total subject score
        subjectCounts[subject][0] += student.examLog[currentExam._id][subject]
        // track subject grade counts
        ++subjectCounts[subject][1][calculateGrade((student.examLog[currentExam._id][subject] / currentExam.points) * 100)]
      })
    })

    let studentGradeCounts = {
      "A": 0,
      "B": 0,
      "C": 0,
      "D": 0,
      "F": 0,
      "Total": 0
    }

    let sortedScores = studentScoreTotals.sort((a, b) => b[1] - a[1])

    const studentAverages = {}
    for (let i = 0; i < sortedScores.length; ++i) {
      let [id, score] = sortedScores[i];


      let studentAverage = (score / (currentExam.points * subjects.length)) * 100
      studentAverages[id] = studentAverage

      ++studentGradeCounts[calculateGrade(studentAverage)]
      ++studentGradeCounts["Total"]

      if (i > 0 && score === sortedScores[i - 1][1]) {
        studentRanks[id] = studentRanks[sortedScores[i - 1][0]];
      } else {
        studentRanks[id] = currentRank;
      }

      currentRank++;
    }

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

    // lines by exam analysis
    page.drawLine({
      start: { x: 30, y: 595 - 230 },
      end: { x: 260, y: 595 - 230 },
      thickness: 2,
      color: rgb(0, 0, 0)
    })
    page.drawLine({
      start: { x: 30, y: 595 - 290 },
      end: { x: 260, y: 595 - 290 },
      thickness: 2,
      color: rgb(0, 0, 0)
    })
    page.drawLine({
      start: { x: 30, y: 595 - 400 },
      end: { x: 260, y: 595 - 400 },
      thickness: 2,
      color: rgb(0, 0, 0)
    })

    // exam analysis
    let varX = 35
    const meanPercent = ((currentExam.meanGrade / (subjects.length * currentExam.points)) * 100).toFixed(1)
    const analysisCategories = [
      "Class Mean:",
      (currentExam.meanGrade == -1 || currentExam.meanGrade === null ? "-" : meanPercent + "%"),
      (currentExam.meanGrade == -1 || currentExam.meanGrade === null ? "-" : calculateGrade(meanPercent))
    ];
    analysisCategories.forEach(category => {
      page.drawText(category, {
        x: varX,
        y: 595 - 265,
        size: 15,
        color: rgb(0, 0, 0),
      })
      varX += category === "Class Mean:" ? 130 : 65
    })


    // grade distribution
    varX = 40
    let varXAnalysis = 40
    Object.keys(studentGradeCounts).forEach((grade, index) => {
      page.drawText(grade, {
        x: varX,
        y: 595 - 330,
        size: 15,
        color: rgb(0, 0, 0),
      })
      page.drawText(String(studentGradeCounts[grade]), {
        x: varXAnalysis,
        y: 595 - 370,
        size: 15,
        color: rgb(0, 0, 0),
      })
      varX += 35
      varXAnalysis += index == 4 ? 46 : 35
    })

    // subject table headers
    varX = 400
    const subjectCategories = ["A", "B", "C", "D", "F", "Average", "Grade", "Rank"];
    subjectCategories.forEach(category => {
      page.drawText(category, {
        x: varX,
        y: 595 - 100,
        size: 15,
        font: boldFont,
        color: rgb(0, 0, 0),
      })
      varX += category.length > 1 ? (category === "Grade" ? 65 : 80) : (category === "F" ? 35 : 45)
    })

    // top line for subject table
    page.drawLine({
      start: { x: 300, y: 595 - 125 },
      end: { x: 842 - 30, y: 595 - 125 },
      thickness: 2,
      color: rgb(0, 0, 0)
    })

    // bottom line for subject table
    page.drawLine({
      start: { x: 300, y: 595 - 400 },
      end: { x: 842 - 30, y: 595 - 400 },
      thickness: 2,
      color: rgb(0, 0, 0)
    })

    // subject table
    varY = (((595 - 125) + (595 - 125 - ((400 - 125) / (sortedSubjects.length)))) / 2) - 5
    const incrementY = (400 - 125) / (sortedSubjects.length)

    let lineY = 595 - 125 - ((400 - 125) / (sortedSubjects.length))
    const incrementLine = (400 - 125) / (sortedSubjects.length)

    sortedSubjects.forEach((subject, index) => {
      const subjectPercent = ((subject[1] / (currentExam.points * currentStudents.length)) * 100).toFixed(1)
      let subjectStats = [
        subject[0].split(" ")[0],
        String(subjectCounts[subject[0]][1]["A"]),
        String(subjectCounts[subject[0]][1]["B"]),
        String(subjectCounts[subject[0]][1]["C"]),
        String(subjectCounts[subject[0]][1]["D"]),
        String(subjectCounts[subject[0]][1]["F"]),
        (isNaN(subjectPercent) || subjectPercent === null ? "-" : subjectPercent + "%"),
        calculateGrade(subjectPercent),
        (isNaN(subjectPercent) ? "-" : String(subjectRanks[subject[0]]))
      ]

      if (index !== sortedSubjects.length - 1) {
        page.drawLine({
          start: { x: 300, y: lineY },
          end: { x: 842 - 30, y: lineY },
          thickness: 2,
          color: rgb(0, 0, 0)
        })
        lineY -= incrementLine
      }

      varX = 300
      subjectStats.forEach((stat, statIndex) => {
        page.drawText(stat, {
          x: varX,
          y: varY,
          size: 15,
          color: rgb(0, 0, 0),
        })
        varX += statIndex === 0 ? 100 : (statIndex === 6 ? 85 : (statIndex === 7 ? 60 : 45))
      })
      varY -= incrementY
    })



    // exam table top line
    page.drawLine({
      start: { x: 30, y: 595 - 460 },
      end: { x: 842 - 30, y: 595 - 460 },
      thickness: 2,
      color: rgb(0, 0, 0)
    })

    // exam table first vertical line
    page.drawLine({
      start: { x: 180, y: 595 - 430 },
      end: { x: 180, y: 25 },
      thickness: 2,
      color: rgb(0, 0, 0)
    })

    // exam table name
    page.drawText("Name", {
      x: 30,
      y: 595 - 440,
      size: 15,
      font: boldFont,
      color: rgb(0, 0, 0),
    })

    //exam table additional constant categories
    varX = 635
    const constantCategories = ["Avg", "Grade", "Rank"];
    constantCategories.forEach(category => {
      page.drawText(category, {
        x: varX,
        y: 595 - 440,
        size: 15,
        font: boldFont,
        color: rgb(0, 0, 0),
      })
      varX += category === "Grade" ? 65 : 55
    })

    // exam table second vertical line
    page.drawLine({
      start: { x: 610, y: 595 - 430 },
      end: { x: 610, y: 25 },
      thickness: 2,
      color: rgb(0, 0, 0)
    })

    // exam table variable subject categories
    varX = 180 + 20
    subjects.forEach(subject => {
      page.drawText(subject.slice(0, 3), {
        x: varX,
        y: 595 - 440,
        size: 15,
        font: boldFont,
        color: rgb(0, 0, 0),
      })
      varX += (610 - 180) / subjects.length
    })

    currentStudents = currentStudents.sort((a, b) => {
      if (studentRanks[a._id] !== studentRanks[b._id]) {
        return studentRanks[a._id] - studentRanks[b._id];
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      return 0;
    })


    // exam table
    varY = 595 - 485
    lineY = 595 - 500
    let pageCount = 1;
    currentStudents.forEach((student, index) => {
      let studentStats = [
        (student.name.length > 18 ? student.name.slice(0, 15) + "..." : student.name),
        studentAverages[student._id].toFixed(1) + "%",
        calculateGrade(studentAverages[student._id]),
        String(studentRanks[student._id])
      ]

      varX = 180 + 10
      subjects.forEach(subject => {
        let percent = ((student.examLog[currentExam._id][subject] / currentExam.points) * 100).toFixed(0)
        page.drawText(percent + "% " + calculateGrade(percent), {
          x: varX,
          y: varY,
          size: 12,
          color: rgb(0, 0, 0),
        })

        varX += (610 - 180) / subjects.length
      })


      if (index != 2) {
        page.drawLine({
          start: { x: 30, y: lineY },
          end: { x: 842 - 30, y: lineY },
          thickness: 2,
          color: rgb(0, 0, 0)
        })
        lineY -= 40
      }

      varX = 30
      studentStats.forEach((stat, index) => {
        page.drawText(stat, {
          x: varX,
          y: varY,
          size: 15,
          color: rgb(0, 0, 0),
        })
        varX += index === 0 ? 600 : (index === 1 ? 80 : 60)
      })
      varY -= 40

      // account for page wrap
      if (index == 2 || ((index - 15) % 13 == 0)) {
        ++pageCount
        page = pdfDoc.addPage([842, 595]);
        varY = 595 - 65;
        lineY = 595 - 40;

        // exam table first vertical line
        page.drawLine({
          start: { x: 180, y: 595 - 40 },
          end: { x: 180, y: 30 },
          thickness: 2,
          color: rgb(0, 0, 0)
        })

        // exam table second vertical line
        page.drawLine({
          start: { x: 610, y: 595 - 40 },
          end: { x: 610, y: 25 },
          thickness: 2,
          color: rgb(0, 0, 0)
        })

        page.drawText("Green Apple Pre & Primary School: " + currentExam.type.charAt(0).toUpperCase() + currentExam.type.slice(1) + " Exam - " + currentExam.month + " " + currentExam.createdAt.slice(0, 4), {
          x: 842 - 300,
          y: 595 - 20,
          size: 10,
          color: rgb(0, 0, 0),
        });
      }
    })

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    saveAs(blob, `${"Class" + currentExam.class + "_" + currentExam.type.charAt(0).toUpperCase() + currentExam.type.slice(1) + "_" + currentExam.month + "_" + currentExam.createdAt.slice(0, 4)}.pdf`);  // Triggers the file download
  }










  const createClassPDF = async (selectedClass) => {

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 400]);

    page.drawText("Class PDF", {
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
      {classDialog && <Dialog_Report_Class setDialog={handleClass} createClassPDF={createClassPDF}></Dialog_Report_Class>}
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