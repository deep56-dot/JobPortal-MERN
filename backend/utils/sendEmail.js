import nodeMailer from "nodemailer"

export const sendEmail = async({email,subject,message})=>{
    const transporter= nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        auth:{
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        },
        port: process.env.SMTP_PORT
    })

    const options= {
        from: process.env.SMTP_EMAIL,
        to : email,
        subject: subject,
        text: message
    }

    await transporter.sendMail(options)
}