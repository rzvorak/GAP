import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login';
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <>

      <div>
        This will appear on every page


      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
      </div>
    </>
  )
}

export default App
