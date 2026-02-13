import bcrypt
from datetime import datetime
from src.db import get_db
from src.types.user_type import User, CreateUserDto, UpdateUserDto

SALT_ROUNDS = 10


async def get_users():
    query = """
        SELECT id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
        FROM users
        WHERE is_active = true
        ORDER BY created_at DESC
    """
    conn = await get_db()
    result = await conn.fetch(query)
    return result


async def get_user_by_id(user_id: int):
    query = """
        SELECT id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
        FROM users
        WHERE id = $1
    """
    conn = await get_db()
    result = await conn.fetchrow(query, user_id)
    return result


async def get_user_by_email(email: str):
    query = """
        SELECT id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
        FROM users
        WHERE email = $1
    """
    conn = await get_db()
    result = await conn.fetchrow(query, email)
    return result


async def get_user_by_username(username: str):
    query = """
        SELECT id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
        FROM users
        WHERE username = $1
    """
    conn = await get_db()
    result = await conn.fetchrow(query, username)
    return result


async def create_user(data: CreateUserDto):
    hashed_password = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt(SALT_ROUNDS)).decode("utf-8")

    query = """
        INSERT INTO users (email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
    """
    conn = await get_db()
    result = await conn.fetchrow(
        query,
        data.email,
        data.username,
        data.full_name,
        hashed_password,
        data.avatar_url,
        data.bio,
        data.role or "user",
    )
    return result


async def update_user(user_id: int, data: UpdateUserDto):
    set_parts = []
    values = []
    param_index = 1

    if data.email is not None:
        set_parts.append(f"email = ${param_index}")
        values.append(data.email)
        param_index += 1

    if data.username is not None:
        set_parts.append(f"username = ${param_index}")
        values.append(data.username)
        param_index += 1

    if data.full_name is not None:
        set_parts.append(f"full_name = ${param_index}")
        values.append(data.full_name)
        param_index += 1

    if data.password is not None:
        hashed_password = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt(SALT_ROUNDS)).decode("utf-8")
        set_parts.append(f"password = ${param_index}")
        values.append(hashed_password)
        param_index += 1

    if data.avatar_url is not None:
        set_parts.append(f"avatar_url = ${param_index}")
        values.append(data.avatar_url)
        param_index += 1

    if data.bio is not None:
        set_parts.append(f"bio = ${param_index}")
        values.append(data.bio)
        param_index += 1

    if data.role is not None:
        set_parts.append(f"role = ${param_index}")
        values.append(data.role)
        param_index += 1

    if data.is_active is not None:
        set_parts.append(f"is_active = ${param_index}")
        values.append(data.is_active)
        param_index += 1

    if not set_parts:
        return await get_user_by_id(user_id)

    set_parts.append("updated_at = CURRENT_TIMESTAMP")
    query = f"""
        UPDATE users
        SET {', '.join(set_parts)}
        WHERE id = ${param_index}
        RETURNING id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
    """
    values.append(user_id)

    conn = await get_db()
    result = await conn.fetchrow(query, *values)
    return result


async def delete_user(user_id: int) -> bool:
    query = """
        DELETE FROM users
        WHERE id = $1
    """
    conn = await get_db()
    result = await conn.execute(query, user_id)
    return result == "DELETE 1"


async def soft_delete_user(user_id: int):
    query = """
        UPDATE users
        SET is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
    """
    conn = await get_db()
    result = await conn.fetchrow(query, user_id)
    return result


async def search_users(keyword: str):
    query = """
        SELECT id, email, username, full_name, password, avatar_url, bio, role, is_active, created_at, updated_at
        FROM users
        WHERE is_active = true
          AND (email ILIKE $1 OR username ILIKE $1 OR full_name ILIKE $1)
        ORDER BY created_at DESC
    """
    conn = await get_db()
    result = await conn.fetch(query, f"%{keyword}%")
    return result


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


user_table_schema = """
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
"""
