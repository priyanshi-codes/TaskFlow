import {inngest} from "../client.js"
import User from "../../models/user.js"
import { NonRetriableError } from "inngest"
import { sendMail} from "../../utils/mailer.js"


export const onUserSignup = inngest.createFunction(
    {id: "on-user-signup", retries : 2},
    {event: "user/signup"},
    async({event, step}) => {
        try {
            //pipeline 1
            const {email} = event.data
          const user=   await step.run("get-user-email",async()=>{
                const userObject = await User.findOne({email})
                if(!userObject) {throw new NonRetriableError("User not found")
                }
            return userObject

            })
            //pipeline 2
            //step to send welcome email
            await step.run("send-welcome-email", async()=>{
                const subject = `Welcome to the app`
                const message = `Hi,
                \n\n 
                Welcome to our app! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out.`

                await sendMail(user.email, subject, message)
            })
            return {success: true}
        } catch (error) {
            console.error("Error in onUserSignup function: ", error.message)
            return {success: false, error: error.message}
        }
    }
)