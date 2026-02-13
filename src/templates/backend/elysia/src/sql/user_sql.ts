import db from "../db";
import bcrypt from "bcrypt";
import type { User, CreateUserDto, UpdateUserDto } from "../types/user_type";

const SALT_ROUNDS = 10;

export async function getUsers(): Promise<User[]> {
  const result = await db`
    SELECT id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
    FROM users
    WHERE is_active = true
    ORDER BY created_at DESC
  `;
  return result as unknown as User[];
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await db`
    SELECT id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
    FROM users
    WHERE id = ${id}
  `;
  if (result.length === 0) return null;
  return result[0] as unknown as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db`
    SELECT id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
    FROM users
    WHERE email = ${email}
  `;
  if (result.length === 0) return null;
  return result[0] as unknown as User;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const result = await db`
    SELECT id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
    FROM users
    WHERE username = ${username}
  `;
  if (result.length === 0) return null;
  return result[0] as unknown as User;
}

export async function createUser(data: CreateUserDto): Promise<User> {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const result = await db`
    INSERT INTO users (email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at)
    VALUES (
      ${data.email},
      ${data.username},
      ${data.full_name},
      ${hashedPassword},
      ${data.avatar_url ?? null},
      ${data.bio ?? null},
      ${data.role ?? "user"},
      true,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
    RETURNING id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
  `;
  return result[0] as unknown as User;
}

export async function updateUser(id: number, data: UpdateUserDto): Promise<User | null> {
  const setParts: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.email !== undefined) {
    setParts.push(`email = $${paramIndex}`);
    values.push(data.email);
    paramIndex++;
  }
  if (data.username !== undefined) {
    setParts.push(`username = $${paramIndex}`);
    values.push(data.username);
    paramIndex++;
  }
  if (data.full_name !== undefined) {
    setParts.push(`full_name = $${paramIndex}`);
    values.push(data.full_name);
    paramIndex++;
  }
  if (data.password !== undefined) {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    setParts.push(`password = $${paramIndex}`);
    values.push(hashedPassword);
    paramIndex++;
  }
  if (data.avatar_url !== undefined) {
    setParts.push(`avatar_url = $${paramIndex}`);
    values.push(data.avatar_url);
    paramIndex++;
  }
  if (data.bio !== undefined) {
    setParts.push(`bio = $${paramIndex}`);
    values.push(data.bio);
    paramIndex++;
  }
  if (data.role !== undefined) {
    setParts.push(`role = $${paramIndex}`);
    values.push(data.role);
    paramIndex++;
  }
  if (data.is_active !== undefined) {
    setParts.push(`is_active = $${paramIndex}`);
    values.push(data.is_active);
    paramIndex++;
  }

  if (setParts.length === 0) {
    return getUserById(id);
  }

  setParts.push(`updated_at = CURRENT_TIMESTAMP`);
  const query = `
    UPDATE users
    SET ${setParts.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
  `;
  values.push(id);

  const result = await db.unsafe(query, values);
  if (result.length === 0) return null;
  return result[0] as unknown as User;
}

export async function deleteUser(id: number): Promise<boolean> {
  const result = await db`
    DELETE FROM users
    WHERE id = ${id}
  `;
  return result.count > 0;
}

export async function softDeleteUser(id: number): Promise<User | null> {
  const result = await db`
    UPDATE users
    SET is_active = false, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
  `;
  if (result.length === 0) return null;
  return result[0] as unknown as User;
}

export async function searchUsers(keyword: string): Promise<User[]> {
  const result = await db`
    SELECT id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
    FROM users
    WHERE is_active = true
      AND (
        email ILIKE ${`%${keyword}%`}
        OR username ILIKE ${`%${keyword}%`}
        OR full_name ILIKE ${`%${keyword}%`}
      )
    ORDER BY created_at DESC
  `;
  return result as unknown as User[];
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export const userTableSchema = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
`;
