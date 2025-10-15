import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.js"
import { inngest } from "../inngest/client.js" 


export const signup = async(req, res)=>{
    const {email,password, skills =[]}= req.body
    try {
        const hashed = await bcrypt.hash(password, 10)
        const user = await User.create({email, password: hashed, skills})

        //fire inngest events
        await inngest.send({
            name: "user/signup",
            data: {
                email
            }
        });
       const token =  jwt.sign(
            {_id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
        )

        res.json({user, token})

    } catch (error) {
        res.status(500).json({error: "Signup failed", message: error.message})
        
    }
}

export const login = async (req, res)=>{
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({error: "User not found"})
        }
        //password is matching or not
        const isMatch = await bcrypt.compare(password, user.password)       
            
        if(!isMatch){
            return res.status(400).json({error: "Invalid credentials"})
        }
        //create the tokens
        const token = jwt.sign(
            {
            _id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET
     );
     res.json({user, token})
        }
    catch (error) {
        res.status(500).json({error: "Login failed", message: error.message})
        
    }
}

export const logout= async(req, res)=>{
    try {
        //check the user is already autheticated or not
        const token = req.headers.authorization.split(" ")[1]
        if(!token){
            return res.status(401).json({error: "Unauthorized"})
        }
        //verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if(error){
              return res.status(401).json({error: "Unauthorized"})
            }
        })
        res.json({message: "Logout successful"})
    } catch (error) {
        res.status(500).json({error: "Logout failed", message: error.message})
    }
}

export const updateUser = async(req, res)=>{
    const {skills = [], role, email} = req.body
    try {
        if(req.user?.role !== "admin"){
            return res.status(403).json({error: "Access denied - only admin can update user details"})
        }
       const user = await User.findOne({email})
       if(!user){
           return res.status(404).json({error: "User not found"})
       }
       await User.updateOne(
        {email},
        {skills: skills.length ? skills : user.skills, role}
       )
       res.json({message: "User updated successfully", user})
    } catch (error) {
        res.status(500).json({error: "User update failed", message: error.message})
    }
}

export const getUser = async(req, res)=>{
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({error: "Access denied - only admin can access user details"})
        }
        const users = await User.find().select("-password")
        return res.json({users})
    } catch (error) {
        res.status(500).json({error: "Failed to retrieve users", message: error.message})
    }
}

