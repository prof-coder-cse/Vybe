import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to, otp) => {
    try {
        console.log("📧 Sending email with Resend...");

        const { data, error } = await resend.emails.send({
            from: "Vybe <onboarding@resend.dev>",
            to: [to],
            subject: "Reset Your Password",
            html: `
                <h2>Reset Your Password</h2>
                <p>Your OTP is <b>${otp}</b></p>
                <p>This OTP expires in 5 minutes.</p>
            `
        });

        if (error) {
            throw new Error(error.message);
        }

        console.log("✅ EMAIL SENT SUCCESSFULLY:", data);

        return data;

    } catch (error) {
        console.error("❌ MAIL ERROR:", error);
        throw error;
    }
};

export default sendMail;
