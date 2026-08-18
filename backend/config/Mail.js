import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
});

const sendMail = async (to, otp) => {
    try {
        console.log("📧 Connecting to Gmail...");

        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: to,
            subject: "Reset Your Password",
            html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
        });

        console.log("✅ EMAIL SENT SUCCESSFULLY:", info.messageId);

        return info;

    } catch (error) {
        console.error("❌ MAIL ERROR:", error);
        throw error;
    }
};

export default sendMail;
