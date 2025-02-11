import React from 'react'
import {Box, VStack, Heading} from '@chakra-ui/react'
import Header from '../components/Header'

const Reports = () => {
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
                >Generate a Report</Heading>
            </Box>
        </VStack>

    </Box>
  )
}

export default Reports