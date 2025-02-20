import express from 'express';

const router = express.Router();

import {createHomework, getHomeworks, updateHomework, deleteHomework} from '../controllers/homework.controller.js'

router.post("/", createHomework);
router.get("/", getHomeworks);
router.put("/:id", updateHomework);
router.delete("/:id", deleteHomework);

export default router;