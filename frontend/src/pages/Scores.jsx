import React from 'react'
import { Box, VStack, Heading, Button, useBreakpointValue } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

import { FaArrowLeft } from 'react-icons/fa';

const Scores = () => {

  const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })

  const classNames = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'
  ]

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
      display="flex"
      flexDir="column"
    >
      <Header />

      <VStack w="100%" flex="1" display={disappearOnMin}>
        <Box
          w="100%"
          h="4rem"
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
      </VStack>

      <Box
        w="100%"
        display={disappearOnMin}
        h="8rem"
        paddingTop="2rem" // control how close plus can get
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

export default Scores