import express from 'express';
import { signup, login, logout, updateUser, getUser } from "../controller/user.js"
import {authenticate} from "../middlewares/auth.js"

const router = express.Router()

router.post("/update-user", authenticate, updateUser );
router.post("/users", authenticate,getUser)

router.post("/signup" ,signup )
router.post("/login", login )
router.post("/logout", logout )

export default router
