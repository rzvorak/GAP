import React, {useState, useEffect} from 'react'
import { Input, Button } from '@chakra-ui/react'
import { IoClose } from "react-icons/io5";
import '../styles/Dialog.css'

const Dialog = ({ setDialog, handleSubmitStudent }) => {
  const [fade, setFade] = useState(false);
  const [currentName, setCurrentName] = useState("");

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
    height: "25rem",
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
    flex: "1",
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

  const dialogClassSelect = {
    width: "80%",
    height: "4rem",
    display: "flex",
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

  const [selectedClass, setSelectedClass] = useState(1); 

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
  };

  const handleSubmitButton = async () => {
    if (currentName !== "") {
      await handleSubmitStudent(currentName, selectedClass);
      handleExit();
    } 
  }

  const handleExit = () => {
    setFade(false);
    setTimeout(() => {
      setDialog(false);
    }, 100)
  };

  useEffect(() => {
    setFade(true)
  }, []);

  return (
    <div style={dialogContainer}>
      <div style={dialog}>
        <div style={dialogHeader}>
          <h1>Add a Student</h1>
          <div onClick={() => handleExit()}>
            <IoClose size="2rem" className="IoClose" />
          </div>
        </div>

        <div style={dialogBody}>
          <div style={dialogBodyText}><p>Name: </p></div>
          <Input
            placeholder="Name (First Middle Sur)"
            style={{ boxShadow: 'var(--box-shadow-classic)' }}
            border="none"
            w="80%"
            borderRadius="0.5rem"
            marginBottom="2rem"
            transition='all 0.3s'
            maxLength={30}
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            _hover={{ transform: "translateY(-3px)" }}></Input>

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
        </div>

        <div style={dialogFooter}>
          <Button
            w="50%"
            h="2.5rem"
            borderRadius={"4rem"}
            borderWidth="2px"
            color="gray.100" 
            fontSize="lg"
            transition="all 0.3s"
            disabled={currentName === ""}
            bg={currentName === "" ? "gray.300" : "green.500"}
            cursor={currentName === "" ? "auto" : "pointer"}
            _hover={{bg: currentName === "" ? "gray.300" : "green.600"}}
            onClick={handleSubmitButton}
          >Add Student</Button>

        </div>
      </div>
    </div>
  )
}

export default Dialog