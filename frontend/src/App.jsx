import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login';
import Landing from './pages/Landing';
import Students from './pages/Students';
import Scores from './pages/Scores';
import Reports from './pages/Reports';
import Statistics from './pages/Statistics';

function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/landing" element={<Landing />} />

          <Route path="/students" element={<Students />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
    </>
  )
}

export default App
