import Header from '../components/Header'
import React from 'react'
import { Box, SimpleGrid, Button, Center, VStack, Heading } from '@chakra-ui/react'
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
                h="14rem"
                w="14rem"
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
                            marginTop="1.5rem"
                            marginBottom="1.5rem">
                                View Students
                            </Heading>
                            <Box color="green.500">
                            <FaRegUser size="5rem"/>
                        </Box>
                    </VStack>
                </Box>
            </Center>

            <Center>
                <Box 
                h="14rem"
                w="14rem"
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
                            marginTop="1.5rem"
                            marginBottom="1.5rem">
                                Enter Scores
                            </Heading>
                            <Box color="green.500">
                            <GoPencil size="5rem"/>
                        </Box>
                    </VStack>
                </Box>
            </Center>

            <Center>
                <Box 
                h="14rem"
                w="14rem"
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
                            marginTop="1.5rem"
                            marginBottom="1.5rem">
                                Create Reports
                            </Heading>
                            <Box color="green.500">
                            <IoDocumentTextOutline size="5rem"/>
                        </Box>
                    </VStack>
                </Box>
            </Center>

            <Center>
                <Box 
                h="14rem"
                w="14rem"
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
                            marginTop="1.5rem"
                            marginBottom="1.5rem">
                                See Statistics
                            </Heading>
                            <Box color="green.500">
                            <SlGraph size="5rem"/>
                        </Box>
                    </VStack>
                </Box>
            </Center>

             

        </SimpleGrid>
    
    </Box>
    
  )
}

export default Landing