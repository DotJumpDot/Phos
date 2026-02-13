export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  password: string;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDto {
  email: string;
  username: string;
  full_name: string;
  password: string;
  avatar_url?: string | null;
  bio?: string | null;
  role?: string;
}

export interface UpdateUserDto {
  email?: string;
  username?: string;
  full_name?: string;
  password?: string;
  avatar_url?: string | null;
  bio?: string | null;
  role?: string;
  is_active?: boolean;
}

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
