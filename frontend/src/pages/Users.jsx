import React, { useState, useEffect } from 'react'
import { Box, VStack, Heading, useBreakpointValue, HStack, Input, Button, Spinner, Center, Text, Link } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

import { FaArrowLeft } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { GoPencil } from "react-icons/go";

import { useUserStore } from '../store/user';
import { useStudentStore } from '../store/student'

import Dialog_User from '../components/Dialog_User';
import Dialog_Delete from '../components/Dialog_Delete';


const Users = () => {
  const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })

  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/landing')
  }

  const { fetchUsers, deleteUser, updateUser, createUser, users } = useUserStore()
  const { fetchStudents, students } = useStudentStore()

  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      await fetchStudents();
      await fetchUsers();
      setIsLoading(false);
    };
    fetchData();
  }, [fetchUsers]);

  const [localUsers, setLocalUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  useEffect(() => {
    setLocalUsers(users.filter(user => user.role !== "admin"));
    setAllUsers(users.filter(user => user.role !== "admin"));
  }, [users]);

  const [search, setSearch] = useState("")
  useEffect(() => {
    setLocalUsers(allUsers.filter(user => user.username.toLowerCase().includes(search.toLowerCase())))
  }, [search])

  const [dialogUser, setDialogUser] = useState(false);
  const [currentMode, setCurrentMode] = useState("")
  const handleStudentButton = () => {

    //createStudentAccount("67dc1c1f656558c276451f4c", "password")

    setCurrentMode("student")
    setDialogUser(!dialogUser);
  }

  const handleTeacherButton = () => {
    setCurrentMode("teacher")
    setDialogUser(!dialogUser)
  }

  const createStudentAccount = async (studentId, password) => {

    const currentStudent = students.find(student => student._id === studentId)

    const splitName = currentStudent.name.toLowerCase().split(" ")
    let newUsername = currentStudent.name.toLowerCase().charAt(0) + splitName[splitName.length - 1]
    const existing = users.filter(user => user.username.startsWith(newUsername)).map(user => user.username.slice(newUsername.length, user.username.length))
    
    // duplicate assignment logic
    if (existing.length !== 0) {
      let max = 0
      for (let i = 0; i < existing.length; ++i) {
        if (existing[i] !== '') {
          if (Number(existing[i] > max)) max = Number(existing[i])
        }
      }
      newUsername += (max + 1)
    }

    console.log(newUsername)

    const { success, message } = await createUser({
      username: newUsername,
      password: password,
      role: "student",
      requestingNewPassword: false,
      identity: studentId
    });
    fetchUsers()
    fetchStudents()
    console.log(success, message);
  }

  const createTeacherAccount = async (teacher, password) => {
    const { success, message } = await createUser({
      username: teacher,
      password: password,
      role: "teacher",
      requestingNewPassword: false,
      identity: teacher
    });
    fetchUsers()

  }

  const [dialogDelete, setDialogDelete] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState("")
  const handleDeleteButton = (userId) => {
    setDeleteUserId(userId);
    setDialogDelete(!dialogDelete);
  }

  // to conform with Dialog_Delete
  const handleDeleteBack = () => {
    console.log("User successfully deleted")
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

      {dialogDelete && <Dialog_Delete handleBack={handleDeleteBack} delete={deleteUser} id={deleteUserId} setDialog={setDialogDelete}></Dialog_Delete>}
      {dialogUser && <Dialog_User users={localUsers} mode={currentMode} students={students} createTeacherAccount={createTeacherAccount} createStudentAccount={createStudentAccount} setDialog={setDialogUser} ></Dialog_User>}

      <VStack
        flex="1"
        display={disappearOnMin}
        flexDir="column"
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
          >Manage Users</Heading>
        </Box>


        <HStack
          mb={{ "xxs": "0.5rem", sm: "1rem" }}
          w="80%"
          display="flex"
          flexDir="row"
          maxW="40rem"
          justifyContent="space-evenly"
          alignItems={"center"}

        >
          <Heading
            color="gray.600"
            fontWeight={"400"}
            fontSize={{ "xxs": "lg", sm: "xl" }}
          >Create Account: </Heading>

          <Button
            borderRadius={"4rem"}
            w="30%"
            borderWidth="2px"
            borderColor={"green.500"}
            bg="none"
            color="green.500"
            fontSize={{ "xxs": "xs", "xs": "base", sm: "lg", lg: "xl" }}
            transition="all 0.3s"
            _hover={{ transform: "translateY(-3px)" }}
            onClick={handleStudentButton}
          >Student</Button>

          <Button
            borderRadius={"4rem"}
            w="30%"
            borderWidth="2px"
            borderColor={"green.500"}
            bg="none"
            color="green.500"
            fontSize={{ "xxs": "xs", "xs": "base", sm: "lg", lg: "xl" }}
            transition="all 0.3s"
            onClick={handleTeacherButton}
            _hover={{ transform: "translateY(-3px)" }}
            marginLeft={{ "xxs": "0rem", "xs": "0.75rem", sm: "0rem" }}

          >Teacher</Button>
        </HStack>


        <HStack
          w="80%"
          display="flex"
          flexDir="row"
          justifyContent="center"
          maxW="40rem"
        >
          <Heading
            marginRight="0.5rem"
            marginBottom="0.3rem"
            color="gray.600"
            fontWeight={"400"}
            fontSize={{ "xxs": "lg", sm: "xl" }}
          >Search: </Heading>

          <Input
            placeholder="Username (Optional)"
            style={{ boxShadow: 'var(--box-shadow-classic)' }}
            border="none"
            borderRadius="0.5rem"
            marginBottom="0.3rem"
            transition='all 0.3s'
            w={{ "xxs": "10rem", "xs": "15rem", sm: "22rem" }}
            _hover={{ transform: "translateY(-3px)" }}
            value={search}
            onChange={(e) => { setSearch(e.target.value) }}
          ></Input>
        </HStack>


        <VStack
          w="100%"
          flex="1"
          gap="0rem"
          display="flex"
          paddingBottom="0rem"
        >
          <HStack
            minH="4rem"
            gap="0"
            w="80%"
            maxW="40rem"
          >
            <Box flex="5">
              <Text ml="1rem" maxW="10rem">Name</Text>
            </Box>
            <Center flex="5">
              <Text paddingRight={{ "xxs": "0.4rem", sm: "0rem" }} >Username</Text>
            </Center>
            <Center flex="1">
              <Text paddingRight={{ "xxs": "0.4rem", sm: "0rem" }} >Password</Text>
            </Center>
            <Center flex="1">
              <Text paddingLeft={{ "xxs": "0.4rem", sm: "0rem" }} ></Text>
            </Center>
            <Center flex="1">
              <Text></Text>
            </Center>
          </HStack>

          <VStack
            w="80%"
            maxW="40rem"
            gap="0rem"
            alignItems={"center"} >

            {isLoading ? (
              <Spinner marginTop="2rem" color="gray.400" borderWidth="4px" cosize="xl" />
            ) : (
              localUsers.length !== 0 ?

                localUsers.map((user, index) => (
                  <Box
                    w="100%"
                    h="3rem"
                    bg={index % 2 === 0 ? "gray.200" : "gray.300"}
                    display="flex"
                    alignItems="center"
                    key={index}>
                    <HStack
                      display="flex"
                      w="100%"
                      gap="0">
                      <Box flex="4" >
                        <Text
                          py="0.5rem"
                          pr="0.5rem"
                          ml="1rem"
                          maxW={{ "xxs": "5rem", "xs": "8rem", sm: "12rem", md: "20rem" }}
                          truncate
                        >{user.role === "student" ? students.find(student => student._id === user.identity).name : user.identity}</Text>
                      </Box>
                      <Box flex="4" >
                        <Text
                          py="0.5rem"
                          pr="0.5rem"
                          ml="1rem"
                          maxW={{ "xxs": "5rem", "xs": "8rem", sm: "12rem", md: "20rem" }}
                          truncate
                        >{user.username}</Text>
                      </Box>
                      <Center flex="1">
                        <Box

                          bottom={{ "xxs": "0rem", sm: "0.7rem" }}
                          right={{ "xxs": "0rem", sm: "1.5rem" }}
                          w="3rem"
                          h="3rem"
                          cursor="pointer"
                          color="green.500"
                          //onClick={() => handleForward(homework._id)}
                          transition="all 0.2s ease-in-out"
                          _hover={{ transform: "translateY(-3px)" }}
                        >
                          <Center h="100%"><GoPencil size="2rem" /></Center>

                        </Box>
                      </Center>
                      <Center flex="1">
                        <Text>{user.role.charAt(0).toUpperCase()}</Text>
                      </Center>
                      <Center flex="1">
                        <Box
                          onClick={() => handleDeleteButton(user._id)}
                        >
                          <IoClose size="2rem" className="IoClose" />

                        </Box>
                      </Center>
                    </HStack>
                  </Box>
                )) :
                <Box
                  w="100%"
                  h="6rem"
                  bg="gray.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center">
                  No Users Found
                </Box>
            )}

          </VStack>
        </VStack>










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

    </Box >
  )
}

export default Users