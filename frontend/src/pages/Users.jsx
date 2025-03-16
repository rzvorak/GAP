import React from 'react'
import { Box, VStack, Heading, useBreakpointValue } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa';


const Users = () => {
  const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })

  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/landing')
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

      <VStack 
        flex="1"
        w="100%">
        <Box
          w="100%"
          h={{ sm: "4rem" }}
          display="flex"
          alignItems={"center"}>
          <Heading
            marginLeft="1rem"
            color="gray.600"
            fontSize="2xl"
            fontWeight={"400"}
          >Users</Heading>
        </Box>
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

export default Users