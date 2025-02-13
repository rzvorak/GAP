import React from 'react'
import { Box, VStack, Heading, Button, Text } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

import { FaArrowLeft } from 'react-icons/fa';

const classNames = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'
]

const Scores = () => {

  const navigate = useNavigate();
  const handleForward = (className) => {
    // use to pass selected class to next page
    navigate("/scores/type", { state: { selectedClass: className } })
  }

  const handleBack = () => {
    navigate('/landing')
  }

  return (
    <Box
      minH={"100vh"}
      maxW={"100vw"}
      bg={"gray.100"}
      color="gray.900"
    >
      <Header />

      <VStack w="100%">
        <Box
          w="100%"
          h={{ sm: "4rem" }}
          display="flex"
          alignItems={"center"}
        >
          <Heading
            marginLeft="1rem"
            color="gray.600"
            fontSize="2xl"
            fontWeight={"400"}
          >
            Select Class:
          </Heading>
        </Box>

        <VStack w="100%">
          {classNames.map((className, index) => (
            <Button
              key={index}
              w="80%"
              maxW="60rem"
              h={{ sm: "2.5rem", md: "3rem", lg: "3.25rem" }}
              borderRadius={"4rem"}
              borderWidth="2px"
              borderColor={"green.500"}
              bg="none"
              color="green.500"
              fontSize={{ sm: "lg", lg: "xl" }}
              transition="all 0.3s"
              marginTop="0.3rem"
              _hover={{ transform: "translateY(-3px)" }}
              onClick={() => handleForward(className)}
            >
              {className}
            </Button>
          ))}
        </VStack>

        <Box
          position="absolute"
          bottom="4rem"
          
          cursor={"pointer"}
          onClick={handleBack}>
          <FaArrowLeft size="1.5rem" className='FaArrowLeft' />         
        </Box>

      </VStack>

    </Box>
  )
}

export default Scores