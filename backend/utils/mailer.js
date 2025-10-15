import nodemailer from 'nodemailer';

export const sendMail = async (to , subject, text) =>{
    try {
        const transport = nodemailer.createTransport({
            host: process.env.MAILTRAP_SMTP_HOST,
            port: process.env.MAILTRAP_SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.MAILTRAP_SMTP_USER,
                pass: process.env.MAILTRAP_SMTP_PASS
            }
        });
        const info = await transport.sendMail({
            from: '"TaskFlow" <8M0tZ@example.com>',
            to,
            subject,
            text,
        });
        console.log("Message sent: ", info.messageId)
        return info
    } catch (error) {
        
    }console.error("Error sending email: ", error);
    throw error;
}