import express from 'express';

const router = express.Router();

import { createUser, getUsers, updateUser, updateUserPassword, deleteUser, loginUser } from '../controllers/user.controller.js';

router.post("/", createUser);

router.get("/", getUsers);

router.put("/:id", updateUser);

router.put("/password/:id", updateUserPassword)

router.delete("/:id", deleteUser);

router.post("/login", loginUser)

export default router;