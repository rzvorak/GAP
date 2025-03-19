import React, { useState, useEffect } from 'react'
import { Button, createListCollection } from '@chakra-ui/react'
import { IoClose } from "react-icons/io5";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '../components/ui/select';


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

    height: "18rem",
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

  const [selectedClass, setSelectedClass] = useState();
  const dialogBodyTextSelectType = {
    height: "2rem",
    display: "flex",
    width: "80%",
    paddingLeft: "0.5rem",
    userSelect: "none",
    marginBottom: "0.2rem",
    transition: "all 0.08s ease-in-out",
    color: selectedClass === undefined ? "#d4d4d8" : "#18181b"
  }

  const [selectedType, setSelectedType] = useState("")
  const dialogBodyTextSelectExam = {
    height: "2rem",
    display: "flex",
    width: "80%",
    paddingLeft: "0.5rem",
    userSelect: "none",
    marginBottom: "0.2rem",
    transition: "all 0.08s ease-in-out",
    color: selectedType === "" ? "#d4d4d8" : "#18181b"
  }

  const dialogFooter = {
    width: "100%",
    height: "6rem",
    display: "flex",
    justifyContent: 'center',
    alignItems: "center",
  }

  const dialogClassSelect = {
    width: "80%",
    height: "4rem",
    display: "flex",
    marginBottom: "1rem",
    flexDirection: "row",
    cursor: "pointer",
  }

  const dialogClass = {
    height: "100%",
    flex: "1",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const dialogClassButton = (isHovered, isSelected) => ({
    height: "0.7rem",
    width: "0.7rem",
    backgroundColor: isSelected ? "#22c55e" : isHovered ? "#22c55e" : "lightgray",
    borderRadius: "0.5rem",
    marginTop: "0.7rem",
    transition: "all 0.2s ease-in-out",
  });

  const [hoverState, setHoverState] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });


  const handleHover = (classId, isHovered) => {
    setHoverState(prevState => ({
      ...prevState,
      [classId]: isHovered
    }));
  }

  // ensure only one class bubble can be selected
  const handleClassSelect = (classId) => {
    if (selectedClass !== classId) {
      setSelectedClass(classId);
    }
    setCurrentExam("")
  };

  const handleSubmitButton = async () => {
    console.log(currentExam[0])
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
  const filteredExams = props.exams
    .filter((exam) => exam.class === selectedClass && (selectedType !== "" ? exam.type === selectedType[0].toLowerCase() : true))
    .map((exam) => ({ label: (exam.type.charAt(0).toUpperCase() + exam.type.slice(1) + " (" + exam.month + ")"), value: exam._id }));

  const frameworks = createListCollection({ items: filteredExams });

  const types = createListCollection({items: [{label: "Monthly", value: "Monthly"}, {label: "Midterm", value: "Midterm"}, {label: "Terminal", value: "Terminal"}]})


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

          <div style={dialogBodyText}><p>Class: </p></div>
          <div style={dialogClassSelect}>
            {[1, 2, 3, 4, 5, 6, 7].map(classId => (
              <div
                key={classId}
                onClick={() => handleClassSelect(classId)}
                onMouseEnter={() => handleHover(classId, true)}
                onMouseLeave={() => handleHover(classId, false)}
                style={dialogClass}>
                {classId}
                <div style={dialogClassButton(hoverState[classId], selectedClass === classId)}></div>
              </div>
            ))}
          </div>

          <div style={dialogBodyTextSelectType}><p>Select Type: </p></div>
          <SelectRoot
            disabled={selectedClass === undefined}
            collection={types}
            value={selectedType}
            onValueChange={(e) => setSelectedType(e.value)}
            w="80%"
            mb="0.75rem"
            borderRadius="0.5rem"
            border="none"
            transition="all 0.3s"
            positioning={{ placement: "bottom", flip: false }}
            _hover={{ transform: selectedClass === undefined ? "translateY(0px)" : "translateY(-3px)" }}
            style={{ boxShadow: 'var(--box-shadow-classic)' }}>
            <SelectTrigger>
              <SelectValueText
                placeholder="" />
            </SelectTrigger>
            <SelectContent padding="0" backgroundColor="gray.100">
              {types.items.map((type) => {
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
                    item={type}
                    key={type.value}>
                    {type.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </SelectRoot>

          <div style={dialogBodyTextSelectExam}><p>Select Exam: </p></div>
          <SelectRoot
            disabled={selectedType === ""}
            collection={frameworks}
            value={currentExam}
            onValueChange={(e) => setCurrentExam(e.value)}
            w="80%"
            borderRadius="0.5rem"
            border="none"
            transition="all 0.3s"
            positioning={{ placement: "bottom", flip: false }}
            _hover={{ transform: selectedType === "" ? "translateY(0px)" : "translateY(-3px)" }}
            style={{ boxShadow: 'var(--box-shadow-classic)' }}>
            <SelectTrigger>
              <SelectValueText
                placeholder="" />
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