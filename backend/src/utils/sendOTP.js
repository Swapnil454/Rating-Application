const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (to, otp) => {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h2>OTP Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This OTP will expire in <b>10 minutes</b>.</p>
        <hr />
        <small>If you did not request this, ignore this email.</small>
      </div>
    `;
    console.log(otp)
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Your OTP Verification Code',
      html: emailHtml,
    });

    if (response.error) {
      console.error('Resend error:', response.error);
    }
  } catch (err) {
    console.error('Failed to send OTP email:', err.message);
  }
};

module.exports = sendOTP;
