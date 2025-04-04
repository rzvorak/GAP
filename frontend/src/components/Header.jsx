import { Box, Center } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Squash as Hamburger } from 'hamburger-react'
import { useLocation, useNavigate } from 'react-router-dom'

const Header = () => {
  // for hamburger
  const [isOpen, setOpen] = useState(false);

  const [homeHover, setHomeHover] = useState(false);
  const [settingsHover, setSettingsHover] = useState(false);
  const [signOutHover, setSignOutHover] = useState(false);

  const menuContainer = {
    position: 'fixed',
    height: "60%",
    backgroundColor: "#f4f4f5",
    bottom: "0rem",
    width: "100%",
    transition: "all 0.3s ease-in-out",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: '0rem',
    transform: isOpen ? "translateY(0px)" : "translateY(100%)",
    zIndex: "2"
  }

  const menuBackground = {
    position: "fixed",
    height: "100%",
    width: "100%",
    backgroundColor: isOpen ? "hsla(0, 0%, 20%, 0.6)" : "hsla(0, 0%, 0%, 0)",
    transition: "all 0.3s ease-in-out",
    zIndex: "1",
    pointerEvents: isOpen ? "all" : "none",
  }

  // easy mobile functionality to click out of menu
  const handleMenuBackground = () => {
    setOpen(false)
  }


  const menuButtonContainer = {
    height: "15%",
    minHeight: "2rem",
    maxHeight: "3rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  }

  const homeButton = {
    fontSize: "1.5rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    userSelect: "none",
    color: homeHover ? "gray" : "black"
  }

  const settingsButton = {
    fontSize: "1.5rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.2s ease-in-out",
    color: settingsHover ? "gray" : "black"
  }

  const signOutButton = {
    fontSize: "1.5rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.2s ease-in-out",
    color: signOutHover ? "gray" : "black"
  }

  const hamburger = {
    zIndex: "3"
  }

  const location = useLocation()
  const navigate = useNavigate()

  const handleHome = () => {
    const role = localStorage.getItem("role")

    if (role !== "student") {
      location.pathname !== '/landing' ? navigate('/landing') : setOpen(false);
    } else {
      (location.pathname !== '/students/student-view') ? navigate('/students/student-view', {state: {studentId: localStorage.getItem("identity")}}) : setOpen(false)
    }
  }


  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate('/');
  }

  return (
    <Box
      minW={"100%"}
      bg="green.500"
      h="5rem"
      display={"flex"}
      justifyContent={"space-between"}
      overflow={"hidden"}
    >
      <Center
        onClick={handleHome}
        color="gray.100"
        p={"1rem"}
        cursor="pointer"
      >
        <svg width="50px" height="50px" fill="currentColor" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M599.872 203.776a189.44 189.44 0 0 1 64.384-4.672l2.624.128c31.168 1.024 51.2 4.096 79.488 16.32 37.632 16.128 74.496 45.056 111.488 89.344 96.384 115.264 82.752 372.8-34.752 521.728-7.68 9.728-32 41.6-30.72 39.936a426.624 426.624 0 0 1-30.08 35.776c-31.232 32.576-65.28 49.216-110.08 50.048-31.36.64-53.568-5.312-84.288-18.752l-6.528-2.88c-20.992-9.216-30.592-11.904-47.296-11.904-18.112 0-28.608 2.88-51.136 12.672l-6.464 2.816c-28.416 12.224-48.32 18.048-76.16 19.2-74.112 2.752-116.928-38.08-180.672-132.16-96.64-142.08-132.608-349.312-55.04-486.4 46.272-81.92 129.92-133.632 220.672-135.04 32.832-.576 60.288 6.848 99.648 22.72 27.136 10.88 34.752 13.76 37.376 14.272 16.256-20.16 27.776-36.992 34.56-50.24 13.568-26.304 27.2-59.968 40.704-100.8a32 32 0 1 1 60.8 20.224c-12.608 37.888-25.408 70.4-38.528 97.664zm-51.52 78.08c-14.528 17.792-31.808 37.376-51.904 58.816a32 32 0 1 1-46.72-43.776l12.288-13.248c-28.032-11.2-61.248-26.688-95.68-26.112-70.4 1.088-135.296 41.6-171.648 105.792C121.6 492.608 176 684.16 247.296 788.992c34.816 51.328 76.352 108.992 130.944 106.944 52.48-2.112 72.32-34.688 135.872-34.688 63.552 0 81.28 34.688 136.96 33.536 56.448-1.088 75.776-39.04 126.848-103.872 107.904-136.768 107.904-362.752 35.776-449.088-72.192-86.272-124.672-84.096-151.68-85.12-41.472-4.288-81.6 12.544-113.664 25.152z" /></svg>
      </Center>

      <Center
        color="gray.100"
        p={"1rem"}>
        <div style={hamburger}>
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
      </Center>

      <div onClick={handleMenuBackground} style={menuBackground}></div>

      <div style={menuContainer}>
        <div style={menuButtonContainer} onMouseEnter={() => setHomeHover(true)} onMouseLeave={() => setHomeHover(false)}>
          <button style={homeButton} onClick={handleHome}>Home</button>
        </div>

        <div style={menuButtonContainer} onMouseEnter={() => setSignOutHover(true)} onMouseLeave={() => setSignOutHover(false)}>
          <button style={signOutButton} onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>

    </Box>
  )
}

export default Header