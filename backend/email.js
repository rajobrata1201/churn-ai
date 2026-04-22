const nodemailer = require("nodemailer");

const sendReport = async (email, summary) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",
      pass: "your-app-password"
    }
  });

  await transporter.sendMail({
    from: "yourgmail@gmail.com",
    to: email,
    subject: "Churn Report",
    text: summary
  });
};

module.exports = sendReport;