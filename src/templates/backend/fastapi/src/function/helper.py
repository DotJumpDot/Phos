import re
from typing import Any
from src.types.user_type import CreateUserDto, UpdateUserDto


def validate_email(email: str) -> bool:
    email_regex = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    return re.match(email_regex, email) is not None


def validate_string(value: Any, min_length: int = 1, max_length: int = 255) -> bool:
    return isinstance(value, str) and min_length <= len(value) <= max_length


def validate_boolean(value: Any) -> bool:
    return isinstance(value, bool)


def validate_create_user_dto(data: dict) -> CreateUserDto:
    errors = []

    if not validate_email(data.get("email", "")):
        errors.append("Invalid email format")

    if not validate_string(data.get("username"), 3, 100):
        errors.append("Username must be between 3 and 100 characters")

    if not validate_string(data.get("full_name"), 1, 255):
        errors.append("Full name must be between 1 and 255 characters")

    if not validate_string(data.get("password"), 6, 255):
        errors.append("Password must be at least 6 characters")

    avatar_url = data.get("avatar_url")
    if avatar_url is not None and not validate_string(avatar_url, 1, 1000):
        errors.append("Avatar URL must be a valid string")

    bio = data.get("bio")
    if bio is not None and not validate_string(bio, 1, 1000):
        errors.append("Bio must be a valid string")

    role = data.get("role")
    if role is not None and not validate_string(role, 1, 50):
        errors.append("Role must be a valid string")

    if errors:
        raise ValueError(f"Validation error: {', '.join(errors)}")

    return CreateUserDto(
        email=data["email"],
        username=data["username"],
        full_name=data["full_name"],
        password=data["password"],
        avatar_url=avatar_url,
        bio=bio,
        role=role or "user",
    )


def validate_update_user_dto(data: dict) -> UpdateUserDto:
    errors = []

    email = data.get("email")
    if email is not None and not validate_email(email):
        errors.append("Invalid email format")

    username = data.get("username")
    if username is not None and not validate_string(username, 3, 100):
        errors.append("Username must be between 3 and 100 characters")

    full_name = data.get("full_name")
    if full_name is not None and not validate_string(full_name, 1, 255):
        errors.append("Full name must be between 1 and 255 characters")

    password = data.get("password")
    if password is not None and not validate_string(password, 6, 255):
        errors.append("Password must be at least 6 characters")

    avatar_url = data.get("avatar_url")
    if avatar_url is not None and not validate_string(avatar_url, 1, 1000) and avatar_url is not None:
        errors.append("Avatar URL must be a valid string or None")

    bio = data.get("bio")
    if bio is not None and not validate_string(bio, 1, 1000) and bio is not None:
        errors.append("Bio must be a valid string or None")

    role = data.get("role")
    if role is not None and not validate_string(role, 1, 50):
        errors.append("Role must be a valid string")

    is_active = data.get("is_active")
    if is_active is not None and not validate_boolean(is_active):
        errors.append("is_active must be a boolean")

    if errors:
        raise ValueError(f"Validation error: {', '.join(errors)}")

    return UpdateUserDto(
        email=email,
        username=username,
        full_name=full_name,
        password=password,
        avatar_url=avatar_url,
        bio=bio,
        role=role,
        is_active=is_active,
    )
