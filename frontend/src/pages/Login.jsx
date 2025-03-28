import React, { useState, useEffect } from 'react'
import { Box, Button, Input, VStack, IconButton} from '@chakra-ui/react'
import { motion, useAnimationFrame } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

import { useUserStore } from '../store/user';
import { InputGroup } from '../components/ui/input-group';

import { Toaster, toaster } from "../components/ui/toaster"

const MotionVStack = motion.create(VStack);

// TODO: request password stuff, alerts for wrong password / no find username
const Login = () => {
  const [currentUsername, setCurrentUsername] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [alertMessage, setAlertMessage] = useState("")
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordUsername, setForgotPasswordUsername] = useState("")

  const { fetchUsers, updateUser, users } = useUserStore();
  // sign out any time this page is visited
  useEffect(() => {
    fetchUsers()
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }, [])

  const handleLogin = async () => {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: currentUsername, password: currentPassword }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("identity", data.identity)
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      data.role !== "student" ? navigate("/landing") : navigate('/students/student-view', { state: { studentId: data.identity } })
    } else {
      toaster.create({
        title: data.message,
        type: "error",
        duration: "2000"
      })
    }
  };

  const handleRequestPassword = async () => {
    const user = users.find((user) => user.username === forgotPasswordUsername)
    if (!user) {
      toaster.create({
        title: "User not found",
        type: "error",
        duration: "2000"
      })
      return;
    }

    // 'false' argument to avoid updating password
    const { success } = await updateUser(user._id, false, {
      ...user,
      requestingNewPassword: true
    })
    toaster.create({
      title: success ? "Request Submitted" : "Server Error",
      type: success ? "success" : "error",
      duration: "2000",
    })
  }

  const [show, setShow] = useState(true)

  const navigate = useNavigate();
  const handleSignInButton = async () => {
    console.log('in handleSignIn: ', currentUsername, currentPassword)
    await handleLogin()
  }

  return (
    <Box
      minH={"100vh"}
      maxW={"100vw"}
      bg={"gray.100"}
      color="gray.900"
      display="flex"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
    >

      <Toaster />


      <MotionVStack
        transition={{ type: "tween", duration: 0.8, ease: "easeInOut" }}
        animate={{ x: isForgotPassword ? "-300%" : 0 }}
        initial={{ x: 0 }}
        w="50%"
        maxW="20rem"
        position="fixed"
      >
        <Box
          marginBottom="3rem"
          color="green.500">
          <svg width="75px" height="75px" fill="currentColor" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M599.872 203.776a189.44 189.44 0 0 1 64.384-4.672l2.624.128c31.168 1.024 51.2 4.096 79.488 16.32 37.632 16.128 74.496 45.056 111.488 89.344 96.384 115.264 82.752 372.8-34.752 521.728-7.68 9.728-32 41.6-30.72 39.936a426.624 426.624 0 0 1-30.08 35.776c-31.232 32.576-65.28 49.216-110.08 50.048-31.36.64-53.568-5.312-84.288-18.752l-6.528-2.88c-20.992-9.216-30.592-11.904-47.296-11.904-18.112 0-28.608 2.88-51.136 12.672l-6.464 2.816c-28.416 12.224-48.32 18.048-76.16 19.2-74.112 2.752-116.928-38.08-180.672-132.16-96.64-142.08-132.608-349.312-55.04-486.4 46.272-81.92 129.92-133.632 220.672-135.04 32.832-.576 60.288 6.848 99.648 22.72 27.136 10.88 34.752 13.76 37.376 14.272 16.256-20.16 27.776-36.992 34.56-50.24 13.568-26.304 27.2-59.968 40.704-100.8a32 32 0 1 1 60.8 20.224c-12.608 37.888-25.408 70.4-38.528 97.664zm-51.52 78.08c-14.528 17.792-31.808 37.376-51.904 58.816a32 32 0 1 1-46.72-43.776l12.288-13.248c-28.032-11.2-61.248-26.688-95.68-26.112-70.4 1.088-135.296 41.6-171.648 105.792C121.6 492.608 176 684.16 247.296 788.992c34.816 51.328 76.352 108.992 130.944 106.944 52.48-2.112 72.32-34.688 135.872-34.688 63.552 0 81.28 34.688 136.96 33.536 56.448-1.088 75.776-39.04 126.848-103.872 107.904-136.768 107.904-362.752 35.776-449.088-72.192-86.272-124.672-84.096-151.68-85.12-41.472-4.288-81.6 12.544-113.664 25.152z" /></svg>
        </Box>
        <Input
          placeholder="Username"
          style={{ boxShadow: 'var(--box-shadow-classic)' }}
          border="none"
          value={currentUsername}
          onChange={(e) => setCurrentUsername(e.target.value)}
          borderRadius="0.5rem"
          marginBottom="0.3rem"
          transition='all 0.3s'
          _hover={{ transform: "translateY(-3px)" }}
        ></Input>

        <InputGroup 
        w="100%" 
        transition='all 0.3s'
        _hover={{ transform: "translateY(-3px)" }}
        endElement={
          <Box 
          overflow="hidden"
          h="100%" 
          display="flex" 
          color="green.500"
          alignItems="center" 
          mb="0.2rem"
          onClick={() => setShow(!show)}>
            {show ? <IoEyeOutline size="1.25rem" /> : <IoEyeOffOutline size="1.25rem"/>}
          </Box>
        }>
          <Input
            type={show ? "password" : "text"}
            placeholder="Password"
            style={{ boxShadow: 'var(--box-shadow-classic)'}}
            border="none"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            borderRadius="0.5rem"
            marginBottom="0.3rem"
          ></Input>
        </InputGroup>

        <Button
          w="100%"
          color="gray.100"
          bg="green.500"
          borderRadius="0.5rem"
          _hover={{ bg: "green.600" }}
          onClick={(handleSignInButton)}>Sign In</Button>
        <Button bg="none"
          color="gray.400"
          fontWeight="400"
          textDecoration="underline"
          _hover={{ color: "gray.500" }}
          onClick={() => setIsForgotPassword(true)}>
          Forgot Password?
        </Button>
        {alertMessage !== "" ? (<Box>{alertMessage}</Box>) : (null)}
      </MotionVStack>

      <MotionVStack
        transition={{ type: "tween", duration: 0.8, ease: "easeInOut" }}
        animate={{ x: isForgotPassword ? "0" : "300%" }}
        initial={{ x: "300%" }}
        w="50%"
        maxW="20rem"
        position={"fixed"}
      >
        <Box
          marginBottom="3rem"
          color="green.500">
          <svg width="75px" height="75px" fill="currentColor" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M599.872 203.776a189.44 189.44 0 0 1 64.384-4.672l2.624.128c31.168 1.024 51.2 4.096 79.488 16.32 37.632 16.128 74.496 45.056 111.488 89.344 96.384 115.264 82.752 372.8-34.752 521.728-7.68 9.728-32 41.6-30.72 39.936a426.624 426.624 0 0 1-30.08 35.776c-31.232 32.576-65.28 49.216-110.08 50.048-31.36.64-53.568-5.312-84.288-18.752l-6.528-2.88c-20.992-9.216-30.592-11.904-47.296-11.904-18.112 0-28.608 2.88-51.136 12.672l-6.464 2.816c-28.416 12.224-48.32 18.048-76.16 19.2-74.112 2.752-116.928-38.08-180.672-132.16-96.64-142.08-132.608-349.312-55.04-486.4 46.272-81.92 129.92-133.632 220.672-135.04 32.832-.576 60.288 6.848 99.648 22.72 27.136 10.88 34.752 13.76 37.376 14.272 16.256-20.16 27.776-36.992 34.56-50.24 13.568-26.304 27.2-59.968 40.704-100.8a32 32 0 1 1 60.8 20.224c-12.608 37.888-25.408 70.4-38.528 97.664zm-51.52 78.08c-14.528 17.792-31.808 37.376-51.904 58.816a32 32 0 1 1-46.72-43.776l12.288-13.248c-28.032-11.2-61.248-26.688-95.68-26.112-70.4 1.088-135.296 41.6-171.648 105.792C121.6 492.608 176 684.16 247.296 788.992c34.816 51.328 76.352 108.992 130.944 106.944 52.48-2.112 72.32-34.688 135.872-34.688 63.552 0 81.28 34.688 136.96 33.536 56.448-1.088 75.776-39.04 126.848-103.872 107.904-136.768 107.904-362.752 35.776-449.088-72.192-86.272-124.672-84.096-151.68-85.12-41.472-4.288-81.6 12.544-113.664 25.152z" /></svg>
        </Box>
        <Input
          placeholder="Username"
          style={{ boxShadow: 'var(--box-shadow-classic)' }}
          border="none"
          borderRadius="0.5rem"
          marginBottom="0.3rem"
          transition='all 0.3s'
          value={forgotPasswordUsername}
          onChange={(e) => setForgotPasswordUsername(e.target.value)}
          _hover={{ transform: "translateY(-3px)" }}></Input>
        <Button
          w="100%"
          color="gray.100"
          bg="green.500"
          borderRadius="0.5rem"
          marginBottom="1rem"
          onClick={() => handleRequestPassword()}
          _hover={{ bg: "green.600" }}
        >Request New Password</Button>
        <Button bg="none" onClick={() => setIsForgotPassword(false)}>
          <FaArrowLeft size="1.5rem" className='FaArrowLeft' />
        </Button>
      </MotionVStack>

    </Box>
  )
}

export default Login