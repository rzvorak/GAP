import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {Box, VStack, Heading, Button, Text} from '@chakra-ui/react';
import Header from '../components/Header';

import { FaArrowLeft } from 'react-icons/fa';
import { GoPencil } from "react-icons/go";

import '../styles/Scores_Type.css'

const Scores_Type = () => {

  const types = ['Homework', 'Monthly', 'Midterm', 'Terminal'];

  const location = useLocation();
  const selectedClass = location.state?.selectedClass;

  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/scores')
  }

  const handleForward = (type) => {
    navigate(`/scores/${type.toLowerCase()}`, { state: {selectedType: type.toLowerCase(), selectedClass: selectedClass}})
  }

  return (
    <Box 
            minH={"100vh"} 
            maxW={"100vw"}
            bg={"gray.100"}
            color="gray.900" 
        >
        <Header></Header>

        <VStack 
        w="100%">
            <Box 
            w="100%"
            h={{sm: "4rem"}}
            display="flex"
            alignItems={"center"}>
                <Heading 
                marginLeft="1rem"
                color="gray.600"
                fontSize="2xl"
                fontWeight={"400"}
                >Select Type:</Heading>
            </Box>

            <VStack w="100%">
                {types.map((type, index) => (
                <Button 
                  key={index}
                  w="80%" 
                  maxW="60rem"
                  h={{sm: "2.5rem", md: "3rem", lg: "4rem"}}
                  borderRadius={"4rem"}
                  borderWidth="2px"
                  borderColor={"green.500"}
                  bg="none"
                  color="green.500"
                  fontSize={{sm: "lg", lg: "xl"}}
                  transition="all 0.3s"
                  marginTop="0.3rem"
                  _hover={{ transform: "translateY(-3px)" }}
                  onClick={() => handleForward(type)}
                  >
                    {type}
                  </Button>
                  ))}
            </VStack>

            <Box 
            position="absolute" 
            bottom="4rem" 
            w="12rem"
            h="3rem"
            display="flex"
            alignItems={"center"}
            justifyContent={"space-between"}
            onClick={handleBack}
            cursor="pointer"
            className='backContainer'>
              <FaArrowLeft size="1.5rem" className='FaArrowLeft'/>

              <Box 
              h="100%" 
              w="80%"
              bg="green.500"
              color="gray.100"
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              userSelect={"none"}
              transition="all 0.3s"
              _hover={{bg: "green.600"}}
              >
                <Text marginRight={"0.5rem"}>{selectedClass}</Text>
                <GoPencil size="1rem"/>
              </Box>
            </Box>

        </VStack>
    </Box>
  )
}

export default Scores_Type