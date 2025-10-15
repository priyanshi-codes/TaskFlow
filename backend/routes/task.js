import express from 'express';
import {authenticate} from "../middlewares/auth.js"
import { createTask, getTask, getTasks } from "../controller/task.js"


const router = express.Router()

router.get("/", authenticate , getTasks);
router.get("/:id", authenticate, getTask);
router.post("/", authenticate, createTask);

export default router
