
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUsername(username: string): boolean {
  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

export function isValidAge(age: number): boolean {
  return age >= 0 && age <= 150;
}

export function meetsMinimumAge(age: number, minimumAge: number = 13): boolean {
  return age >= minimumAge;
}
