import type { CreateUserDto, UpdateUserDto } from "../types/user_type";

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateString(value: any, minLength: number = 1, maxLength: number = 255): boolean {
  return typeof value === "string" && value.length >= minLength && value.length <= maxLength;
}

export function validateBoolean(value: any): boolean {
  return typeof value === "boolean";
}

export function validateCreateUserDto(data: any): CreateUserDto {
  const errors: string[] = [];

  if (!validateEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (!validateString(data.username, 3, 100)) {
    errors.push("Username must be between 3 and 100 characters");
  }

  if (!validateString(data.full_name, 1, 255)) {
    errors.push("Full name must be between 1 and 255 characters");
  }

  if (!validateString(data.password, 6, 255)) {
    errors.push("Password must be at least 6 characters");
  }

  if (data.avatar_url !== undefined && data.avatar_url !== null && !validateString(data.avatar_url, 1, 1000)) {
    errors.push("Avatar URL must be a valid string");
  }

  if (data.bio !== undefined && data.bio !== null && !validateString(data.bio, 1, 1000)) {
    errors.push("Bio must be a valid string");
  }

  if (data.role !== undefined && data.role !== null && !validateString(data.role, 1, 50)) {
    errors.push("Role must be a valid string");
  }

  if (errors.length > 0) {
    throw new Error(`Validation error: ${errors.join(", ")}`);
  }

  return {
    email: data.email,
    username: data.username,
    full_name: data.full_name,
    password: data.password,
    avatar_url: data.avatar_url ?? null,
    bio: data.bio ?? null,
    role: data.role ?? "user",
  };
}

export function validateUpdateUserDto(data: any): UpdateUserDto {
  const errors: string[] = [];

  if (data.email !== undefined && !validateEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (data.username !== undefined && !validateString(data.username, 3, 100)) {
    errors.push("Username must be between 3 and 100 characters");
  }

  if (data.full_name !== undefined && !validateString(data.full_name, 1, 255)) {
    errors.push("Full name must be between 1 and 255 characters");
  }

  if (data.password !== undefined && !validateString(data.password, 6, 255)) {
    errors.push("Password must be at least 6 characters");
  }

  if (data.avatar_url !== undefined && !validateString(data.avatar_url, 1, 1000) && data.avatar_url !== null) {
    errors.push("Avatar URL must be a valid string or null");
  }

  if (data.bio !== undefined && !validateString(data.bio, 1, 1000) && data.bio !== null) {
    errors.push("Bio must be a valid string or null");
  }

  if (data.role !== undefined && !validateString(data.role, 1, 50)) {
    errors.push("Role must be a valid string");
  }

  if (data.is_active !== undefined && !validateBoolean(data.is_active)) {
    errors.push("is_active must be a boolean");
  }

  if (errors.length > 0) {
    throw new Error(`Validation error: ${errors.join(", ")}`);
  }

  return {
    email: data.email,
    username: data.username,
    full_name: data.full_name,
    password: data.password,
    avatar_url: data.avatar_url,
    bio: data.bio,
    role: data.role,
    is_active: data.is_active,
  };
}
