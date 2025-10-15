import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {type: String, default: "TODO"},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: "User",default: null},
    priority: {type: String, enum: ["Low", "Medium", "High"], default: "Medium"},
    deadline: Date,
    helpfulNotes: String,
    relatedSkills: [String],
    createdAt: {type: Date, default: Date.now},

})

export default mongoose.model("Task", taskSchema);
