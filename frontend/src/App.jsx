import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import Login from './pages/Login';
import Landing from './pages/Landing';

import Students from './pages/Students';
import Student from './pages/Student';
import Student_Comments from './pages/Student_Comments';
import Student_Profile from './pages/Student_Profile';
import Student_Scores from './pages/Student_Scores';

import Scores from './pages/Scores';
import Scores_Type from './pages/Scores_Type';
import Scores_Homework from './pages/Scores_Homework';
import Homework from './pages/Homework'
import Scores_Exam from './pages/Scores_Exam';
import Exam from './pages/Exam'

import Reports from './pages/Reports';

import Statistics from './pages/Statistics';

import Settings from './pages/Settings';

import Users from './pages/Users';

import NotFound from './pages/NotFound'


function App() {



  const ProtectedRoute = () => {
    const token = localStorage.getItem("token");
    return token ? <Outlet /> : <Navigate to="/" />;
  };

  const AdminRoute = () => {
    const role = localStorage.getItem("role");
    return role === "admin" ? <Outlet /> : <Navigate to="/" />
  }

  const TeacherRoute = () => {
    const role = localStorage.getItem("role")
    return role === "admin" || role === "teacher" ? <Outlet /> : <Navigate to="/" />
  }


  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>

          <Route element={<TeacherRoute />}>
            <Route path="/landing" element={<Landing />} />

            <Route path="/students" element={<Students />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/statistics" element={<Statistics />} />

            <Route element={<AdminRoute />}>
              <Route path="/settings" element={<Settings />} />
              <Route path="/users" element={<Users />} />
            </Route>

            <Route path="/scores/type" element={<Scores_Type />} />
            <Route path="/scores/homework" element={<Scores_Homework />} />
            <Route path="/scores/exam" element={<Scores_Exam />} />

            <Route path="/scores/exam-view" element={<Exam />} />
            <Route path="/scores/homework-view" element={<Homework />} />

          </Route>

          <Route path="/students/student-view" element={<Student />} />
          <Route path="/students/student-view/scores" element={<Student_Scores />} />
          <Route path="/students/student-view/comments" element={<Student_Comments />} />
          <Route path="/students/student-view/profile" element={<Student_Profile />} />
          
        </Route>

        <Route path="*" element={<NotFound />} /> 

      </Routes>
    </>
  )
}

export default App
