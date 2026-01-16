
const otpRequestStore = new Map();

const OTP_COOLDOWN_MS = 60 * 1000; // 1 minute

function checkOtpCooldown(email) {
  const lastRequestTime = otpRequestStore.get(email);

  if (!lastRequestTime) {
    otpRequestStore.set(email, Date.now());
    return true;
  }

  const timeDiff = Date.now() - lastRequestTime;

  if (timeDiff < OTP_COOLDOWN_MS) {
    return false;
  }

  otpRequestStore.set(email, Date.now());
  return true;
}

module.exports = {
  checkOtpCooldown,
};
