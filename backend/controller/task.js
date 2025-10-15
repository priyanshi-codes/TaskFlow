import {inngest} from "../inngest/client.js"
import Task from "../models/task.js"

export const createTask = async(req , res)=>{
    try {
        const {title, description} = req.body
        if(!title || !description){
            return res.status(400).json({
                message:"Title and description"
            })
        }
       const newTask = await Task.create({
            title, 
            description,
            createdBy: req.user._id.toString()
        })
        
        //ai pipeline
        await inngest.send({
            name: "task/create",
            data: {
                taskId : newTask._id.toString(),
                title,
                description,
                createdBy: req.user._id.toString()
            }
        })
        return res.status(201).json({
            message: "Task created successfully",
            task: newTask
        })
    } catch (error) {
        console.error("Error in createTask:", error.message);
        return res.status(500).json({
            message: "Internal server error"
        })
        
    }
}

export const getTasks = async(req, res)=>{
    try {
        const user = req.user
        let tasks = []
        if(user.role !== "user"){
           tasks= await Task.find({

            }).populate("assignedTo",["email","_id"])
            .sort({createdAt: -1})
        }else{
            tasks = await Task.find({createdBy : user._id})
            .select("title description status createdAt helpfulNotes relatedSkills")
            .sort({createdAt: -1})
        }
        return res.status(200).json({
            tasks: tasks
        })
    } catch (error) {
        console.error("Error in getTasks:", error.message);
        return res.status(500).json({
           message: "Internal server error" 
        })
        
    }
}

export const getTask = async(req , res) =>{
    try {
        const user = req.user
        let task;
        if(user.role !== "user"){
            task = await Task.findById(req.params.id).populate("assignedTo", ["email", "_id"]);
        }else{
           task = await Task.findOne({
                createdBy: user._id,
                _id : req.params.id
            }).select("title description status createdAt helpfulNotes relatedSkills")
        }
        if(!task){
            return res.status(404).json({
                message: "Task not found"
            })
        }
        return res.status(200).json({task})
    } catch (error) {
        console.error("Error in getTask:", error.message);
        return res.status(500).json({
            message: "Internal server error"
        })
        
    }
}

