import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },

    tls: {
        rejectUnauthorized: false
    },

    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
});

const sendMail = async (to, otp) => {
    try {
        console.log("📧 Connecting to Gmail...");

        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject: "Reset Your Password",
            html: `
                <h2>Password Reset</h2>
                <p>Your OTP is: <b>${otp}</b></p>
                <p>This OTP expires in 5 minutes.</p>
            `
        });

        console.log("✅ EMAIL SENT:", info.messageId);

        return info;

    } catch (error) {
        console.error("❌ MAIL ERROR:", error);
        throw error;
    }
};

export default sendMail;
