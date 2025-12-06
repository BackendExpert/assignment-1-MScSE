const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendEmail = async ({ to, subject, html, attachments }) => {
    try {
        const info = await transporter.sendMail({
            from: `"Simple Draud Detection" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments: attachments || [],
        });
        console.log("Email sent:", info.messageId);
        return true;
    } catch (err) {
        console.error("Email error:", err.message);
        return false;
    }
};

module.exports = sendEmail;
