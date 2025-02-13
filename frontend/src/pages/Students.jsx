import Header from '../components/Header'
import ClassButton from '../components/ClassButton'

import React from 'react'
import '../styles/App.css'
import { Box, VStack, Heading, HStack, Input, Button, Text } from '@chakra-ui/react'


const Students = () => {
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
                w="100%"
                h="100%"
                display="flex"
                flexDir={"column"}
                flex="1">
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
                    >Student Database</Heading>
                </Box>

                <Box
                    w="100%"
                    h={{ sm: "4rem" }}
                    display="flex"
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <HStack
                        alignItems={"center"}
                    >
                        <Heading
                            marginRight="0.5rem"
                            marginBottom="0.3rem"
                            color="gray.600"
                            fontWeight={"400"}
                            fontSize="xl"
                        >Class: </Heading>

                        <ClassButton class="1"></ClassButton>
                        <ClassButton class="2"></ClassButton>
                        <ClassButton class="3"></ClassButton>
                        <ClassButton class="4"></ClassButton>
                        <ClassButton class="5"></ClassButton>
                        <ClassButton class="6"></ClassButton>
                        <ClassButton class="7"></ClassButton>

                    </HStack>
                </Box>

                <Box
                    w="100%"
                    h={{ sm: "4rem" }}
                    display="flex"
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <HStack
                        alignItems={"center"}
                    >
                        <Heading
                            marginRight="0.5rem"
                            marginBottom="0.3rem"
                            color="gray.600"
                            fontWeight={"400"}
                            fontSize="xl"
                        >Search: </Heading>

                        <Input
                            placeholder="Student Name (Optional)"
                            style={{ boxShadow: 'var(--box-shadow-classic)' }}
                            border="none"
                            borderRadius="0.5rem"
                            marginBottom="0.3rem"
                            transition='all 0.3s'
                            w="22rem"
                            _hover={{ transform: "translateY(-3px)" }}
                        ></Input>
                    </HStack>
                </Box>

                <Box
                    w="100%"
                    h={{ sm: "4rem" }}
                    display="flex"
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <HStack
                        alignItems={"center"}
                    >

                        <Button 
                            borderRadius={"4rem"}
                            w="12rem"
                            bg="green.500"
                            color="gray.100"
                            fontSize={{ sm: "lg", lg: "xl" }}
                            transition="all 0.3s"
                            _hover={{transform: "translateY(-3px)"}}
                            marginRight="1.5rem"
                        >Get Students</Button>

                        <Button 
                            borderRadius={"4rem"}
                            w="12rem"
                            borderWidth="2px"
                            borderColor={"green.500"}
                            bg="none"
                            color="green.500"
                            fontSize={{ sm: "lg", lg: "xl" }}
                            transition="all 0.3s"
                            _hover={{transform: "translateY(-3px)"}}
                        >Add a Student</Button>
                    </HStack>
                </Box>

                <VStack
                w="100%"
                flex="1"
                //bg="red"
                display="flex"
                paddingBottom="2rem"
                >
                    <HStack 
                    flex="1" 
                    minH="4rem" 
                     
                    w="80%" 
                    maxW="40rem">
                        <Text>Name</Text>
                        <Text>Class</Text>
                        <Text>Grade</Text>

                    </HStack>

                    <VStack 
                    flex="4" 
                    bg="gray.200" 
                    w="80%"
                    maxW="40rem"
                    minH="12rem"
                    alignItems={"center"} >
                        <Text marginTop="5rem" color="gray.500">No Students Found</Text>
                        
                    </VStack>

                </VStack>

            </VStack>
        </Box>
    )
}

export default Students