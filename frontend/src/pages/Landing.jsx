import Header from '../components/Header'
import React from 'react'
import { Box, SimpleGrid, useBreakpointValue, Center, VStack, Heading } from '@chakra-ui/react'
import '../styles/App.css'

// icon imports
import { FaRegUser } from "react-icons/fa6";
import { GoPencil } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLockOpenOutline } from "react-icons/io5";
import { SlGraph } from "react-icons/sl";

import { useNavigate } from 'react-router-dom';

const Landing = () => {

    const navigate = useNavigate();
    const handleForward = (box) => {
        navigate('/' + box.split(" ")[1].toLowerCase());
    }

    // TODO: implement
    const loginCondition = true;

    const teacherBoxes = ["View Students", "Enter Scores", "Create Reports", "See Statistics"]
    const adminBoxes = ["View Students", "Enter Scores", "Create Reports", "See Statistics", "School Settings", "Manage Users"]

    const iconSize = useBreakpointValue({ "xxs": "3rem", "xs": "4rem", sm: "5rem", md: "7rem", lg: "9rem" });
    const disappearOnMin = useBreakpointValue({ "min": "none", "xxs": "grid" })

    return (

        <Box
            minH={"100vh"}
            maxW={"100vw"}
            bg={"gray.100"}
            color="gray.900"
        >
            <Header></Header>

            <SimpleGrid
                display={disappearOnMin}
                columns={useBreakpointValue({ "xxs": 1, sm: 2 })}
                w={"full"}
                marginTop={"2rem"}
            >

                {(loginCondition ? adminBoxes : teacherBoxes).map((box, index) => (
                    <Center key={index}>
                        <Box
                            h={{ "xxs": "8rem", "xs": "10rem", sm: "14rem", md: "16rem", lg: "17rem", xl: "17rem" }}
                            w={{ "xxs": "12rem", "xs": "18rem", sm: "14rem", md: "23rem", lg: "29rem", xl: "38rem" }}
                            bg="gray.100"
                            marginBottom="2rem"
                            borderRadius={"1.25rem"}
                            display="flex"
                            flexDirection={"column"}
                            style={{ boxShadow: 'var(--box-shadow-classic)' }}
                            onClick={() => handleForward(box)}
                            transition="all 0.3s"
                            _hover={{ cursor: 'pointer', transform: "translateY(-5px)" }}
                        >
                            <VStack h="100%" >
                                <Heading
                                    color="gray.600"
                                    fontWeight="400"
                                    marginTop={{ "xxs": "0.75rem", "xs": "1rem", sm: "1.5rem", md: "2rem", lg: "2rem" }}
                                    marginBottom={{ "xxs": "0.5rem", "xs": "1rem", sm: "1.5rem", md: "1.5rem", lg: "2rem" }}
                                    fontSize={{ sm: "lg", md: "2xl", lg: "3xl" }}
                                >{box}</Heading>
                                <Box color="green.500">
                                    {box === "School Settings" ? <IoSettingsOutline size={iconSize} /> : null}
                                    {box === "Manage Users" ? <IoLockOpenOutline size={iconSize} /> : null}
                                    {box === "View Students" ? <FaRegUser size={iconSize} /> : null}
                                    {box === "Enter Scores" ? <GoPencil size={iconSize} /> : null}
                                    {box === "Create Reports" ? <IoDocumentTextOutline size={iconSize} /> : null}
                                    {box === "See Statistics" ? <SlGraph size={iconSize} /> : null}
                                </Box>
                            </VStack>
                        </Box>
                    </Center>
                ))}


            </SimpleGrid>
        </Box>

    )
}

export default Landing