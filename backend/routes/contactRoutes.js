import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/contact", async (req, res) => {
  const { name, email, contact, feedback } = req.body;

  try {
    // Log the email credentials (for debugging, remove in production)
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

    // Use your domain’s SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",  // Replace with your hosting SMTP
      port: 465,                   // 465 for SSL, 587 for TLS
      secure: true,                // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    // Mail content
    const mailOptions = {
      from: `"${name}" <${email}>`,     // sender (form submitter)
      to: "aaiconferences@gmail.com",         // your receiving email
      subject: `New Feedback from ${name}`,
      text: `
        📩 You have a new feedback submission:

        Name: ${name}
        Email: ${email}
        Contact: ${contact}

        Feedback:
        ${feedback}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Feedback sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending mail:", error);
    res.status(500).json({ error: "Failed to send feedback" });
  }
});

export default router;
