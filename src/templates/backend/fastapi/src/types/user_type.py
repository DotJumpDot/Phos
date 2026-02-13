from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class User(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    password: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    role: str = "user"
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CreateUserDto(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    full_name: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=6, max_length=255)
    avatar_url: Optional[str] = Field(None, max_length=1000)
    bio: Optional[str] = Field(None, max_length=1000)
    role: Optional[str] = Field(None, max_length=50)


class UpdateUserDto(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=100)
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    password: Optional[str] = Field(None, min_length=6, max_length=255)
    avatar_url: Optional[str] = Field(None, max_length=1000)
    bio: Optional[str] = Field(None, max_length=1000)
    role: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ApiResponse(BaseModel):
    success: bool
    data: Optional[any] = None
    message: Optional[str] = None
    error: Optional[str] = None
