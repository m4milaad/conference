import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "contact@rtip2r.org",
    pass: "your-email-password"
  }
});

transporter.sendMail({
  from: '"Test" <contact@rtip2r.org>',
  to: "aaiconferences@gmail.com",
  subject: "Test Email",
  text: "Hello from conference website!"
}, (err, info) => {
  if (err) console.error(err);
  else console.log("Sent:", info.response);
});