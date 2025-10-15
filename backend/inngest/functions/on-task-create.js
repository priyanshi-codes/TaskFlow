import {inngest} from "../client.js"
import Task from "../../models/task.js"
import User from "../../models/user.js"
import { NonRetriableError } from "inngest"
import { sendMail} from "../../utils/mailer.js"
import { analyseTask } from "../../utils/ai.js"

export const onTaskCreate = inngest.createFunction(
    {
      id : "on-task-create",
        retries : 2  
    },
    {
        event : "task/create"
    },
    async ({event, step})=>{
        try {
            const {taskId} = event.data

            //fetch task from db
          const task = await step.run("fetch-task", async()=>{
             const taskObject = await Task.findById(taskId)
            if(!taskObject){
               throw new NonRetriableError("Task not found")
            }
            return taskObject
           })

           //pipeline 2 
           //update the value
           await step.run("update-task-status", async()=>{
            await Task.findByIdAndUpdate(task._id,{
                status :"TODO"
            })
           })
            
           //pipleline 3
          const aiResponse=  await analyseTask(task)

          const relatedSkills = await step.run("ai-processing", async()=>{
            let skills = []
            if(aiResponse){
                // Convert priority to proper case
                const priorityMap = {
                    "low": "Low",
                    "medium": "Medium",
                    "high": "High"
                };
                
                await Task.findByIdAndUpdate(task._id,{
                    priority: priorityMap[aiResponse.priority?.toLowerCase()] || "Medium",
                    helpfulNotes: aiResponse.helpfulnotes || "",
                    status: "IN-PROGRESS",
                    relatedSkills: Array.isArray(aiResponse.relatedskills) ? aiResponse.relatedskills : []
                })

                skills = aiResponse.relatedskills || []
            }
            return skills || []
          })

          //pipeline 4 -assigned task to the matching skills

          const moderator = await step.run("assign-moderator", async()=>{
            // First try to find a moderator with matching skills
            let user = null;
            
            if (Array.isArray(relatedSkills) && relatedSkills.length > 0) {
                user = await User.findOne({
                    role: "moderator",
                    skills: {
                        $elemMatch: {
                            $regex: relatedSkills.join("|"),
                            $options: "i"
                        }
                    }
                });
            } else {
                // If no skills or empty skills array, find any moderator
                user = await User.findOne({ role: "moderator" });
            }
            if(!user){
               user = await User.findOne({
                role: "admin"
               })
            }
            await Task.findByIdAndUpdate(task._id,{
                assignedTo : user?._id || null
            })
            return user
          });

          //pipeline 5 
          //send email to the user
          await step.run("send-email-notification", async()=>{
            if(moderator){
              const finalTask=   await Task.findById(task._id)
              await sendMail(
                moderator.email,
                "Task Assigned",
                `A new task is assigned to you ${finalTask.title}`
              )
            }
          })

          return {success : true}
        } catch (error) {
            console.error("Error in onTaskCreate:", error);
            return {success: false}
        }

    }
) 