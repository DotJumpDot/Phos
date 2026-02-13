import { Elysia, t } from "elysia";
import { userService } from "../service/user_service";
import { validateString, validateCreateUserDto, validateUpdateUserDto } from "../function/helper";
import type { ApiResponse, UserResponse } from "../types/user_type";

export const userApi = new Elysia({ prefix: "/users" })
  .get(
    "/",
    async () => {
      try {
        const users = await userService.getAllUsers();
        return {
          success: true,
          data: users,
          message: "Users retrieved successfully",
        } as ApiResponse<UserResponse[]>;
      } catch (error) {
        throw {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        } as ApiResponse<never>;
      }
    },
    {
      detail: {
        tags: ["Users"],
        summary: "Get all users",
        description: "Retrieve all active users from the database",
      },
    }
  )

  .get(
    "/:id",
    async ({ params, set }) => {
      try {
        const id = parseInt(params.id);
        if (isNaN(id) || id <= 0) {
          set.status = 400;
          throw new Error("Invalid user ID");
        }

        const user = await userService.getUserById(id);
        if (!user) {
          set.status = 404;
          throw new Error("User not found");
        }

        return {
          success: true,
          data: user,
          message: "User retrieved successfully",
        } as ApiResponse<UserResponse>;
      } catch (error) {
        throw {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        } as ApiResponse<never>;
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ["Users"],
        summary: "Get user by ID",
        description: "Retrieve a specific user by their ID",
      },
    }
  )

  .get(
    "/search/:keyword",
    async ({ params }) => {
      try {
        const keyword = params.keyword;
        if (!validateString(keyword, 1, 100)) {
          throw new Error("Search keyword must be between 1 and 100 characters");
        }

        const users = await userService.searchUsers(keyword);
        return {
          success: true,
          data: users,
          message: "Users retrieved successfully",
        } as ApiResponse<UserResponse[]>;
      } catch (error) {
        throw {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        } as ApiResponse<never>;
      }
    },
    {
      params: t.Object({
        keyword: t.String(),
      }),
      detail: {
        tags: ["Users"],
        summary: "Search users",
        description: "Search for users by email, username, or full name",
      },
    }
  )

  .post(
    "/",
    async ({ body, set }) => {
      try {
        const validatedData = validateCreateUserDto(body);
        const user = await userService.createUser(validatedData);
        set.status = 201;
        return {
          success: true,
          data: user,
          message: "User created successfully",
        } as ApiResponse<UserResponse>;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("already exists") || errorMessage.includes("already taken")) {
          set.status = 409;
        } else if (errorMessage.includes("Validation error")) {
          set.status = 400;
        } else {
          set.status = 400;
        }
        throw {
          success: false,
          error: errorMessage,
        } as ApiResponse<never>;
      }
    },
    {
      body: t.Object({
        email: t.String(),
        username: t.String(),
        full_name: t.String(),
        password: t.String(),
        avatar_url: t.Optional(t.String()),
        bio: t.Optional(t.String()),
        role: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Users"],
        summary: "Create a new user",
        description: "Create a new user with the provided data",
      },
    }
  )

  .put(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const id = parseInt(params.id);
        if (isNaN(id) || id <= 0) {
          set.status = 400;
          throw new Error("Invalid user ID");
        }

        const validatedData = validateUpdateUserDto(body);
        const user = await userService.updateUser(id, validatedData);
        if (!user) {
          set.status = 404;
          throw new Error("User not found");
        }

        return {
          success: true,
          data: user,
          message: "User updated successfully",
        } as ApiResponse<UserResponse>;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("already in use") || errorMessage.includes("already taken")) {
          set.status = 409;
        } else if (errorMessage.includes("not found")) {
          set.status = 404;
        } else if (errorMessage.includes("Validation error")) {
          set.status = 400;
        } else {
          set.status = 400;
        }
        throw {
          success: false,
          error: errorMessage,
        } as ApiResponse<never>;
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        email: t.Optional(t.String()),
        username: t.Optional(t.String()),
        full_name: t.Optional(t.String()),
        password: t.Optional(t.String()),
        avatar_url: t.Optional(t.String()),
        bio: t.Optional(t.String()),
        role: t.Optional(t.String()),
        is_active: t.Optional(t.Boolean()),
      }),
      detail: {
        tags: ["Users"],
        summary: "Update a user",
        description: "Update an existing user's information",
      },
    }
  )

  .delete(
    "/:id",
    async ({ params, set }) => {
      try {
        const id = parseInt(params.id);
        if (isNaN(id) || id <= 0) {
          set.status = 400;
          throw new Error("Invalid user ID");
        }

        const deleted = await userService.deleteUser(id);
        if (!deleted) {
          set.status = 404;
          throw new Error("User not found");
        }

        return {
          success: true,
          message: "User deleted successfully",
        } as ApiResponse<never>;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("not found")) {
          set.status = 404;
        } else {
          set.status = 400;
        }
        throw {
          success: false,
          error: errorMessage,
        } as ApiResponse<never>;
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ["Users"],
        summary: "Delete a user",
        description: "Permanently delete a user from the database",
      },
    }
  )

  .post(
    "/:id/soft-delete",
    async ({ params, set }) => {
      try {
        const id = parseInt(params.id);
        if (isNaN(id) || id <= 0) {
          set.status = 400;
          throw new Error("Invalid user ID");
        }

        const user = await userService.softDeleteUser(id);
        if (!user) {
          set.status = 404;
          throw new Error("User not found");
        }

        return {
          success: true,
          data: user,
          message: "User soft deleted successfully",
        } as ApiResponse<UserResponse>;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("not found")) {
          set.status = 404;
        } else {
          set.status = 400;
        }
        throw {
          success: false,
          error: errorMessage,
        } as ApiResponse<never>;
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ["Users"],
        summary: "Soft delete a user",
        description: "Deactivate a user without permanently deleting them",
      },
    }
  )

  .onError(({ error, set }) => {
    if (error && typeof error === "object" && "success" in error) {
      return error;
    }
    set.status = 500;
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    } as ApiResponse<never>;
  });
