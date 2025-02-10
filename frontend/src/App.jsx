import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login';
import { Box, ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
    </>
  )
}

export default App
