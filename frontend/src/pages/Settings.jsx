import React, { useState, useEffect } from 'react'
import { Box, VStack, Heading, useBreakpointValue, Spinner, Text, HStack, SimpleGrid } from '@chakra-ui/react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa';

import { NumberInputField, NumberInputRoot } from '../components/ui/number-input';



const Settings = () => {
  const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "flex" })

  const [settings, setSettings] = useState({})
  const [localDistribution, setLocalDistribution] = useState({})
  const [localCutoffs, setLocalCutoffs] = useState({})


  const [isSettingsLoading, setIsSettingsLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data.data)
      setLocalDistribution(data.data.distribution)
      setLocalCutoffs(data.data.cutoffs)
      setIsSettingsLoading(false)
    }
    fetchSettings()
  }, [])

  useEffect(() => {

  })

  const updateSettings = async () => {

  }

  const cutoffBackground = {
    "A": "green.700",
    "B": "green.600",
    "C": "green.500",
    "D": "green.400",
    "F": "green.300"
  }
  const cutoffColumns = useBreakpointValue({ "xxs": 1, "xs": 2, sm: 2, md: 4 })


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



      {!isSettingsLoading ? (

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
            <Heading
              marginLeft="1rem"
              color="gray.600"
              fontSize="2xl"
              fontWeight={"400"}
            >School Settings</Heading>
          </Box>

          <Box
            w="80%"
            h={{ sm: "3rem" }}
            display="flex"
            alignItems={"center"}>
            <Heading
              color="gray.600"
              fontSize="xl"
              fontWeight={"400"}
            >Distribution:</Heading>
          </Box>

          {Object.keys(localDistribution).map((type, index) => (
            <Box w="80%"
              display="flex"
              key={index}>

              <VStack
                w={{ "xxs": "25rem", "xs": "25rem", sm: "20rem" }}
              //bg="red"
              >
                <Box
                  display="flex"
                  flexDir="row"
                  justifyContent="space-between"
                  alignItems="center"
                  pr="1rem"
                  w="100%"
                >
                  <Text w={{ "xxs": "60%", "xs": "60%", sm: "45%" }}>{type.charAt(0).toUpperCase() + type.slice(1)}:</Text>
                  <NumberInputRoot
                    defaultValue="10"
                    w={{ "xxs": "40%", "xs": "40%", sm: "55%" }}
                    h="fill"
                    borderRadius="0.5rem"
                    transition="all 0.3s"
                    value={localDistribution[type]}
                    onValueChange={(e) => setLocalDistribution({
                      ...localDistribution,
                      [type]: Math.max(0, Math.min(100, e.value))
                    })}
                    min={0}
                    max={100}
                    style={{ boxShadow: 'var(--box-shadow-classic)' }}
                    _hover={{ transform: "translateY(-3px)" }}
                  >
                    <NumberInputField borderWidth={"0"} />
                  </NumberInputRoot>
                </Box>
              </VStack>

              <HStack
                w={{ "xxs": "50%", "xs": "60%", sm: "70%" }}
                gap="0rem"
              //bg="blue"
              >
                <Box h="100%" borderRadius="0.1rem" w="0.25rem" bg="gray.700"></Box>

                <Box h="80%" bg="green.500" borderRightRadius="0.5rem" w={localDistribution[type] + "%"}></Box>

              </HStack>
            </Box>))}

          <Box
            w="80%"
            h={{ sm: "3rem" }}
            display="flex"
            alignItems={"center"}>
            <Heading
              color="gray.600"
              fontSize="xl"
              fontWeight={"400"}
            >Grade Cutoffs:</Heading>
          </Box>

          <VStack w="80%" justifyContent="center">

            {localCutoffs["A"] > localCutoffs["B"] && localCutoffs["B"] > localCutoffs["C"] && localCutoffs["C"] > localCutoffs["D"] ? (

              <Box h="1.5rem" w="100%" display="flex" justifyContent="flex-start">
                <Box
                  bg={cutoffBackground["A"]}
                  w={(100 - localCutoffs["A"]) + "%"}
                ></Box>

                <Box
                  bg={cutoffBackground["B"]}
                  w={(localCutoffs["A"] - localCutoffs["B"]) + "%"}
                ></Box>

                <Box
                  bg={cutoffBackground["C"]}
                  w={(localCutoffs["B"] - localCutoffs["C"]) + "%"}
                ></Box>

                <Box
                  bg={cutoffBackground["D"]}
                  w={(localCutoffs["C"] - localCutoffs["D"]) + "%"}
                ></Box>

                <Box
                  bg={cutoffBackground["F"]}
                  w={(localCutoffs["D"] - localCutoffs["F"]) + "%"}
                ></Box>
              </Box>

            ) : (
              <Box h="1.5rem" w="100%" display="flex" justifyContent="center" bg="gray.200"></Box>
            )}


            <SimpleGrid
              columns={cutoffColumns}
              w="100%">
              {Object.keys(localCutoffs).map((grade, index) => (
                grade !== "F" ?
                  <Box
                    display="flex"
                    flexDir="row"
                    alignItems="center"
                    p="1rem"
                    key={index}
                  >
                    <Text mr="1rem">{grade}:</Text>
                    <NumberInputRoot
                      defaultValue="10"
                      w="90%"
                      h="fill"
                      borderRadius="0.5rem"
                      transition="all 0.3s"
                      value={localCutoffs[grade]}
                      onValueChange={(e) => setLocalCutoffs({
                        ...localCutoffs,
                        [grade]: Math.max(0, Math.min(100, e.value))
                      })}
                      min={0}
                      max={100}
                      style={{ boxShadow: 'var(--box-shadow-classic)' }}
                      _hover={{ transform: "translateY(-3px)" }}
                    >
                      <NumberInputField borderWidth={"0"} />
                    </NumberInputRoot>
                  </Box>
                  : (null)))}
            </SimpleGrid>

          </VStack>



          <Box
            w="80%"
            h={{ sm: "3rem" }}
            display="flex"
            alignItems={"center"}>
            <Heading
              color="gray.600"
              fontSize="xl"
              fontWeight={"400"}
            >Class Subjects:</Heading>
          </Box>

          <Box
            w="80%"
            h={{ sm: "3rem" }}
            display="flex"
            alignItems={"center"}>
            <Heading
              color="gray.600"
              fontSize="xl"
              fontWeight={"400"}
            >Student Information:</Heading>
          </Box>

        </VStack>

      ) : (

        <Box w="100%" h="100%" flex="1" display="flex" justifyContent="center" alignItems="center">
          <Spinner color="green.500" borderWidth="4px" cosize="xl" />
        </Box>
      )}



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

export default Settings