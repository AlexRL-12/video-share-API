import { validateEmail, validatePassword } from "../middleware/validations";

// Prueba para la función validateEmail
test("validateEmail function should return true for valid email", () => {
  const email = "john@example.com";

  // Llama a la función validateEmail
  const result = validateEmail(email);

  // Verifica que el resultado sea true
  expect(result).toBe(true);
});

// Prueba para la función validatePassword
test("validatePassword function should return null for a valid password", () => {
  const password = "Abcdef123!";

  // Llama a la función validatePassword
  const result = validatePassword(password);

  // Verifica que el resultado sea null
  expect(result).toBeNull();
});
