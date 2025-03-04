import express from 'express'

const router = express.Router()

import {createSettings, updateSettings, getSettings} from '../controllers/settings.controller.js'

router.post("/", createSettings)
router.put("/", updateSettings)
router.get("/", getSettings)

export default router;