import Header from '../components/Header'
import ClassButton from '../components/ClassButton'

import React from 'react'
import {Box, VStack, Heading, HStack } from '@chakra-ui/react'


const Students = () => {
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
                >Student Database</Heading>
            </Box>

            <Box 
            w="100%"
            h={{sm: "4rem"}}
            display="flex"
            alignItems={"center"}
            justifyContent={"center"}>
                <HStack 
                alignItems={"center"}
                >
                    <Heading 
                    marginRight="0.5rem"
                    marginBottom="0.3rem"
                    color="gray.600"
                    fontWeight={"400"}
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



        </VStack>
    </Box>
  )
}

export default Students