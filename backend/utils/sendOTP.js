// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail", // or another provider
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
  
  

// });

// const sendOTP = async (to, otp) => {
//   try {
//     await transporter.sendMail({
//       from: `"Rating App" <${process.env.EMAIL_USER}>`,
//       to,
//       subject: "Your OTP Verification Code",
//       html: `<p>Your OTP code is: <b>${otp}</b>. It expires in 10 minutes.</p>`,
//     });
//     console.log("✅ OTP email sent to:", to);
//     console.log("✅ OTP email sent to:", otp);
//   } catch (err) {
//     console.error("❌ Failed to send OTP:", err.message);
//   }
// };


// module.exports = sendOTP;
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

    // 🔥 NON-BLOCKING SEND (IMPORTANT)
    sgMail.send(msg)
      .then(() => console.log("✅ OTP email sent to:", to))
      .catch(err => console.error("❌ SendGrid error:", err.message));

  } catch (err) {
    console.error("❌ Failed to send OTP:", err.message);
  }
};

module.exports = sendOTP;
