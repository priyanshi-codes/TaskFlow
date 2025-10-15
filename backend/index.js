import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import {serve} from "inngest/express"
import dotenv from "dotenv"
import taskRoutes from "./routes/task.js"
import userRoutes from "./routes/user.js"
import { inngest } from "./inngest/client.js"
import {onUserSignup} from "./inngest/functions/on-signup.js"
import {onTaskCreate} from "./inngest/functions/on-task-create.js"

// Load environment variables from .env file
dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth" , userRoutes);
app.use("/api/tasks", taskRoutes);
app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions : [onUserSignup , onTaskCreate]   
    })
)

//connect mongoose
mongoose
        .connect(process.env.MONGODB_URI)
        .then(()=>{
            console.log("MongoDB connected");
            app.listen(PORT, ()=>{
                console.log(`Server running on port ${PORT}`);
            })
        })
        .catch((error)=>console.error("MongoDB connection error:", error));
