import express from 'express';

const router = express.Router();

import { createStudent, getStudents, updateStudent, deleteStudent } from '../controllers/student.controller.js';

router.post("/", createStudent);

router.get("/", getStudents);

router.put("/:id", updateStudent);

router.delete("/:id", deleteStudent);

export default router;