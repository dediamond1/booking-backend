import bcrypt from 'bcryptjs';

// Password strength requirements
const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_REQUIREMENTS = [
  { regex: /[A-Z]/, message: 'At least one uppercase letter' },
  { regex: /[a-z]/, message: 'At least one lowercase letter' },
  { regex: /[0-9]/, message: 'At least one number' },
  { regex: /[^A-Za-z0-9]/, message: 'At least one special character' }
];

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string, 
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function validatePasswordStrength(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
  }

  const failedRequirements = PASSWORD_REQUIREMENTS
    .filter(req => !req.regex.test(password))
    .map(req => req.message);

  if (failedRequirements.length > 0) {
    return `Password must contain: ${failedRequirements.join(', ')}`;
  }

  return null;
}
