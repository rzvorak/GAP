import express from 'express';

const router = express.Router();

import {createExam, getExams, updateExam, deleteExam} from '../controllers/exam.controller.js'

router.post("/", createExam);
router.get("/", getExams);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

export default router;