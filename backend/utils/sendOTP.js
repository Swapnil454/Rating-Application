
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOTP = async (to, otp) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_FROM, // MUST be verified in SendGrid
      subject: "Your OTP Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>OTP Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP will expire in <b>10 minutes</b>.</p>
          <hr />
          <small>If you did not request this, ignore this email.</small>
        </div>
      `,
    };

    sgMail.send(msg)
      .then(() => console.log("OTP email sent to:", to))
      .catch(err => console.error("SendGrid error:", err.message));

  } catch (err) {
    console.error("Failed to send OTP:", err.message);
  }
};

module.exports = sendOTP;
