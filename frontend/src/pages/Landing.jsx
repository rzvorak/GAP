import Header from '../components/Header'
import React from 'react'
import { Box, SimpleGrid, useBreakpointValue, Center, VStack, Heading } from '@chakra-ui/react'
import '../styles/App.css'
import '../styles/Header.css'

// icon imports
import { FaRegUser } from "react-icons/fa6";
import { GoPencil } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { SlGraph } from "react-icons/sl";

import { useNavigate } from 'react-router-dom';

const Landing = () => {

    const navigate = useNavigate();
    const handleViewStudents= () => {
        navigate('/students')
    }

    const handleEnterScores= () => {
        navigate('/scores')
    }

    const handleCreateReports= () => {
        navigate('/reports')
    }

    const handleSeeStatistics= () => {
        navigate('/statistics')
    }

    const iconSize = useBreakpointValue({sm: "5rem", md: "7rem", lg: "9rem"});


  return (
    
    <Box 
        minH={"100vh"} 
        maxW={"100vw"}
        bg={"gray.100"}
        color="gray.900" 
    >
        <Header></Header>

        <SimpleGrid
            columns="2"
            w={"full"}
            marginTop={"2rem"}
            rowGap={"2rem"}
        >
            <Center>
                <Box 
                h={{sm: "14rem", md: "16rem", lg: "17rem", xl: "17rem"}}
                w={{sm: "14rem", md: "23rem", lg: "29rem", xl: "38rem"}}
                bg="gray.100"
                borderRadius={"1.25rem"}
                display="flex"
                flexDirection={"column"}
                style={{ boxShadow: 'var(--box-shadow-classic)' }}
                onClick={handleViewStudents}
                transition="all 0.3s"
                _hover={{cursor: 'pointer', transform: "translateY(-5px)"}}>
                    <VStack h="100%">
                            <Heading 
                            color="gray.600" 
                            fontWeight="400" 
                            marginTop={{sm: "1.5rem", md: "2rem", lg:"2rem"}}
                            marginBottom={{sm: "1.5rem", md: "1.5rem", lg: "2rem" }}
                            fontSize={{sm: "lg", md: "2xl", lg: "3xl"}}>
                                View Students
                            </Heading>
                            <Box color="green.500">
                                <FaRegUser size={iconSize}/>
                            </Box>
                    </VStack>
                </Box>
            </Center>

            <Center>
                <Box 
                h={{sm: "14rem", md: "16rem", lg: "17rem", xl: "17rem"}}
                w={{sm: "14rem", md: "23rem", lg: "29rem", xl: "38rem"}}
                bg="gray.100"
                borderRadius={"1.25rem"}
                display="flex"
                flexDirection={"column"}
                style={{ boxShadow: 'var(--box-shadow-classic)' }}
                onClick={handleEnterScores}
                transition="all 0.3s"
                _hover={{cursor: 'pointer', transform: "translateY(-5px)"}}>
                    <VStack h="100%">
                            <Heading 
                            color="gray.600" 
                            fontWeight="400" 
                            marginTop={{sm: "1.5rem", md: "2rem", lg:"2rem"}}
                            marginBottom={{sm: "1.5rem", md: "1.5rem", lg: "2rem" }}
                            fontSize={{sm: "lg", md: "2xl", lg: "3xl"}}>
                                Enter Scores
                            </Heading>
                            <Box color="green.500">
                                <GoPencil size={iconSize}/>
                            </Box>
                    </VStack>
                </Box>
            </Center>

            <Center>
                <Box 
                h={{sm: "14rem", md: "16rem", lg: "17rem", xl: "17rem"}}
                w={{sm: "14rem", md: "23rem", lg: "29rem", xl: "38rem"}}
                bg="gray.100"
                borderRadius={"1.25rem"}
                display="flex"
                flexDirection={"column"}
                style={{ boxShadow: 'var(--box-shadow-classic)' }}
                onClick={handleCreateReports}
                transition="all 0.3s"
                _hover={{cursor: 'pointer', transform: "translateY(-5px)"}}>
                    <VStack h="100%">
                            <Heading 
                            color="gray.600" 
                            fontWeight="400" 
                            marginTop={{sm: "1.5rem", md: "2rem", lg:"2rem"}}
                            marginBottom={{sm: "1.5rem", md: "1.5rem", lg: "2rem" }}
                            fontSize={{sm: "lg", md: "2xl", lg: "3xl"}}>
                                Create Reports
                            </Heading>
                            <Box color="green.500">
                                <IoDocumentTextOutline size={iconSize}/>
                            </Box>
                    </VStack>
                </Box>
            </Center>

            <Center>
                <Box 
                h={{sm: "14rem", md: "16rem", lg: "17rem", xl: "17rem"}}
                w={{sm: "14rem", md: "23rem", lg: "29rem", xl: "38rem"}}
                bg="gray.100"
                borderRadius={"1.25rem"}
                display="flex"
                flexDirection={"column"}
                style={{ boxShadow: 'var(--box-shadow-classic)' }}
                onClick={handleSeeStatistics}
                transition="all 0.3s"
                _hover={{cursor: 'pointer', transform: "translateY(-5px)"}}>
                    <VStack h="100%">
                            <Heading 
                            color="gray.600" 
                            fontWeight="400" 
                            marginTop={{sm: "1.5rem", md: "2rem", lg:"2rem"}}
                            marginBottom={{sm: "1.5rem", md: "1.5rem", lg: "2rem" }}
                            fontSize={{sm: "lg", md: "2xl", lg: "3xl"}}>
                                See Statistics
                            </Heading>
                            <Box color="green.500">
                                <SlGraph size={iconSize}/>
                            </Box>
                    </VStack>
                </Box>
            </Center>

             

        </SimpleGrid>
    
    </Box>
    
  )
}

export default Landing