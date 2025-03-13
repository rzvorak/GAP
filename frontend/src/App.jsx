import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login';
import Landing from './pages/Landing';

import Students from './pages/Students';
import Student from './pages/Student';

import Scores from './pages/Scores';
import Scores_Type from './pages/Scores_Type';
import Scores_Homework from './pages/Scores_Homework';
import Homework from './pages/Homework'
import Scores_Exam from './pages/Scores_Exam';
import Exam from './pages/Exam'

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
          <Route path="/scores/exam" element={<Scores_Exam />} />

          <Route path="/scores/exam-view" element={<Exam />} />
          <Route path="/scores/homework-view" element={<Homework />} />

          <Route path="/students/student-view" element={<Student />} />
        </Routes>
    </>
  )
}

export default App
