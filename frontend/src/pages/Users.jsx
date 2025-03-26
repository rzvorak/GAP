import React, { useState, useEffect } from 'react'
import { Box, VStack, Heading, useBreakpointValue, HStack, Input, Button, Spinner, Center, Text, Checkbox } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

import { FaArrowLeft } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { GoPencil } from "react-icons/go";

import { useUserStore } from '../store/user';
import { useStudentStore } from '../store/student'

import { Toaster, toaster } from "../components/ui/toaster"

import Dialog_User from '../components/Dialog_User';
import Dialog_Delete from '../components/Dialog_Delete';
import Dialog_Password from '../components/Dialog_Password'


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

  // search logic
  const [search, setSearch] = useState("")
  const [checkedStudents, setCheckedStudents] = useState(true)
  const [checkedTeachers, setCheckedTeachers] = useState(true)
  useEffect(() => {
    setLocalUsers(allUsers.filter(user => user.username.toLowerCase().includes(search.toLowerCase()) && (checkedTeachers || user.role !== "teacher") && (checkedStudents || user.role !== "student")))
  }, [search, checkedStudents, checkedTeachers])


  const [dialogUser, setDialogUser] = useState(false);
  const [currentMode, setCurrentMode] = useState("")
  const handleStudentButton = () => {
    setCurrentMode("student")
    setDialogUser(!dialogUser);
  }

  const handleTeacherButton = () => {
    setCurrentMode("teacher")
    setDialogUser(!dialogUser)
  }

  const [dialogPassword, setDialogPassword] = useState(false)
  const [editUser, setEditUser] = useState({})
  const handleEditButton = (user) => {
    setEditUser(user)
    setDialogPassword(!dialogPassword)
  }

  const handleSubmitPassword = async (newPassword) => {
    const { success } = await updateUser(editUser._id, true, {
      ...editUser,
      password: newPassword,
      requestingNewPassword: false
    })
    toaster.create({
      title: success ? "Password saved" : "Error saving password",
      type: success ? "success" : "error",
      duration: "2000"
    })

  }

  const createStudentAccount = async (studentId, password) => {

    const currentStudent = students.find(student => student._id === studentId)

    const splitName = currentStudent.name.trim().toLowerCase().split(" ")
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

    const { success } = await createUser({
      username: newUsername,
      password: password,
      role: "student",
      requestingNewPassword: false,
      identity: studentId
    });

    toaster.create({
      title: success ? "Account created successfully" : "Error creating account",
      type: success ? "success" : "error",
      duration: "2000"
    })

    fetchUsers()
    fetchStudents()
  }

  const createTeacherAccount = async (teacherName, password) => {

    const splitName = teacherName.trim().toLowerCase().split(" ")
    let newUsername = teacherName.toLowerCase().charAt(0) + splitName[splitName.length - 1]
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

    const { success } = await createUser({
      username: newUsername,
      password: password,
      role: "teacher",
      requestingNewPassword: false,
      identity: teacherName
    });

    toaster.create({
      title: success ? "Account created successfully" : "Error creating account",
      type: success ? "success" : "error",
      duration: "2000"
    })

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
    toaster.create({
      title: "Account deleted successfully",
      type: "success",
      duration: "2000"
    })
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
      <Toaster />
      <Header></Header>

      {dialogPassword && <Dialog_Password handleSubmitPassword={handleSubmitPassword} user={editUser} setDialog={setDialogPassword}></Dialog_Password>}
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
          <Box ml="1rem" mt="0.25rem"
            cursor={"pointer"}
            onClick={handleBack}>
            <FaArrowLeft size="1.5rem" className='FaArrowLeft' />
          </Box>
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

        <HStack
          mt="0.5rem"

          w="80%"
          display="flex"
          flexDir="row"
          maxW="40rem"
          justifyContent="space-evenly"
          alignItems={"center"}
        >

          <Checkbox.Root
            transition="all 0.3s"
            _hover={{ transform: "translateY(-3px)" }}
            variant="solid"
            size="lg"
            checked={checkedStudents}
            onCheckedChange={(e) => setCheckedStudents(!!e.checked)}
          >
            <Checkbox.HiddenInput border="none" />
            <Checkbox.Control bg="gray.100" border="2px solid gray" borderRadius="0.5rem">
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>Show Students</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root
            transition="all 0.3s"
            _hover={{ transform: "translateY(-3px)" }}
            variant="solid"
            size="lg"
            checked={checkedTeachers}
            onCheckedChange={(e) => setCheckedTeachers(!!e.checked)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control bg="gray.100" border="2px solid gray" borderRadius="0.5rem">
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>Show Teachers</Checkbox.Label>
          </Checkbox.Root>

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
            <Box w="35%">
              <Text
                ml="1rem"
                maxW={{ "xxs": "5rem", "xs": "4rem", sm: "8rem", md: "20rem" }}
              >Name</Text>
            </Box>
            <Box w="35%">
              <Text
                truncate
                maxW={{ "xxs": "3rem", "xs": "5rem", sm: "8rem", md: "20rem" }}
              >Username</Text>
            </Box>
            <Center
              w="10%">
              <Text ml={{ "xxs": "0.4rem", "xs": "0.5rem", sm: "0rem" }} >Password</Text>
            </Center>
            <Box w="5%">
              <Text  ></Text>
            </Box>
            <Box w="5%">
              <Text></Text>
            </Box>
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
                      <Box w="35%" >
                        <Text
                          py="0.5rem"
                          ml="1rem"
                          maxW={{ "xxs": "5rem", "xs": "4rem", sm: "8rem", md: "20rem" }}
                          truncate
                        >{user.role === "student" ? students.find(student => student._id === user.identity).name : user.identity}</Text>
                      </Box>
                      <Box w="35%" >
                        <Text
                          py="0.5rem"
                          maxW={{ "xxs": "3rem", "xs": "6rem", sm: "8rem", md: "20rem" }}
                          truncate
                        >{user.username}</Text>
                      </Box>
                      <Center w="10%">
                        <Box
                          w="3rem"
                          h="3rem"
                          cursor="pointer"
                          color={user.requestingNewPassword ? "orange.300" : "green.500"}
                          onClick={() => handleEditButton(user)}
                          transition="all 0.2s ease-in-out"
                          _hover={{ transform: "translateY(-3px)" }}
                        >
                          <Center h="100%">
                            <Text fontWeight="bold" fontSize="2rem" pb="0.3rem" pr="0.2rem">{user.requestingNewPassword ? "!" : (null)}</Text>
                            <GoPencil size="2rem" />
                          </Center>

                        </Box>
                      </Center>
                      <Center w="10%">
                        <Text>{user.role.charAt(0).toUpperCase()}</Text>
                      </Center>
                      <Center w="10%" mr="0.2rem">
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