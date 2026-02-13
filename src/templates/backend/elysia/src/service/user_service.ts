import * as UserSQL from "../sql/user_sql";
import type { User, CreateUserDto, UpdateUserDto, UserResponse } from "../types/user_type";

export class UserService {
  async getAllUsers(): Promise<UserResponse[]> {
    const users = await UserSQL.getUsers();
    return users.map(this.mapToResponse);
  }

  async getUserById(id: number): Promise<UserResponse | null> {
    const user = await UserSQL.getUserById(id);
    if (!user) return null;
    return this.mapToResponse(user);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await UserSQL.getUserByEmail(email);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await UserSQL.getUserByUsername(username);
  }

  async createUser(data: CreateUserDto): Promise<UserResponse> {
    const existingUser = await UserSQL.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const existingUsername = await UserSQL.getUserByUsername(data.username);
    if (existingUsername) {
      throw new Error("Username already taken");
    }

    const user = await UserSQL.createUser(data);
    return this.mapToResponse(user);
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<UserResponse | null> {
    const existingUser = await UserSQL.getUserById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    if (data.email) {
      const emailUser = await UserSQL.getUserByEmail(data.email);
      if (emailUser && emailUser.id !== id) {
        throw new Error("Email already in use");
      }
    }

    if (data.username) {
      const usernameUser = await UserSQL.getUserByUsername(data.username);
      if (usernameUser && usernameUser.id !== id) {
        throw new Error("Username already taken");
      }
    }

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    ) as UpdateUserDto;

    const user = await UserSQL.updateUser(id, filteredData);
    if (!user) return null;
    return this.mapToResponse(user);
  }

  async deleteUser(id: number): Promise<boolean> {
    const existingUser = await UserSQL.getUserById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    return await UserSQL.deleteUser(id);
  }

  async softDeleteUser(id: number): Promise<UserResponse | null> {
    const existingUser = await UserSQL.getUserById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const user = await UserSQL.softDeleteUser(id);
    if (!user) return null;
    return this.mapToResponse(user);
  }

  async searchUsers(keyword: string): Promise<UserResponse[]> {
    const users = await UserSQL.searchUsers(keyword);
    return users.map(this.mapToResponse);
  }

  private mapToResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}

export const userService = new UserService();
