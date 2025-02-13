import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login';
import Landing from './pages/Landing';

import Students from './pages/Students';

import Scores from './pages/Scores';
import Scores_Type from './pages/Scores_Type';
import Scores_Homework from './pages/Scores_Homework';
import Scores_Monthly from './pages/Scores_Monthly';
import Scores_Midterm from './pages/Scores_Midterm';
import Scores_Terminal from './pages/Scores_Terminal';

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

          <Route path="/scores/type" element={<Scores_Type />} />
          <Route path="/scores/homework" element={<Scores_Homework />} />
          <Route path="/scores/monthly" element={<Scores_Monthly />} />
          <Route path="/scores/midterm" element={<Scores_Midterm />} />
          <Route path="/scores/terminal" element={<Scores_Terminal />} />
        </Routes>
    </>
  )
}

export default App
