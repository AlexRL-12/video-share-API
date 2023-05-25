export const validateEmail = (email) => {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    return "Password should be at least 8 characters long";
  }

  if (!/\d/.test(password)) {
    return "Password should contain at least one digit";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password should contain at least one uppercase letter";
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return "Password should contain at least one special character (!@#$%^&*)";
  }

  return null;
};

export default {
  validateEmail,
  validatePassword,
};
