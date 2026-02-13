import src.sql.user_sql as UserSQL
from src.types.user_type import User, CreateUserDto, UpdateUserDto, UserResponse


class UserService:
    async def get_all_users(self):
        users = await UserSQL.get_users()
        return [self.map_to_response(user) for user in users]

    async def get_user_by_id(self, user_id: int):
        user = await UserSQL.get_user_by_id(user_id)
        if not user:
            return None
        return self.map_to_response(user)

    async def get_user_by_email(self, email: str):
        return await UserSQL.get_user_by_email(email)

    async def get_user_by_username(self, username: str):
        return await UserSQL.get_user_by_username(username)

    async def create_user(self, data: CreateUserDto):
        existing_user = await UserSQL.get_user_by_email(data.email)
        if existing_user:
            raise ValueError("User with this email already exists")

        existing_username = await UserSQL.get_user_by_username(data.username)
        if existing_username:
            raise ValueError("Username already taken")

        user = await UserSQL.create_user(data)
        return self.map_to_response(user)

    async def update_user(self, user_id: int, data: UpdateUserDto):
        existing_user = await UserSQL.get_user_by_id(user_id)
        if not existing_user:
            raise ValueError("User not found")

        if data.email:
            email_user = await UserSQL.get_user_by_email(data.email)
            if email_user and email_user["id"] != user_id:
                raise ValueError("Email already in use")

        if data.username:
            username_user = await UserSQL.get_user_by_username(data.username)
            if username_user and username_user["id"] != user_id:
                raise ValueError("Username already taken")

        filtered_data = {k: v for k, v in data.model_dump().items() if v is not None}
        if not filtered_data:
            return await self.get_user_by_id(user_id)

        user = await UserSQL.update_user(user_id, UpdateUserDto(**filtered_data))
        if not user:
            return None
        return self.map_to_response(user)

    async def delete_user(self, user_id: int) -> bool:
        existing_user = await UserSQL.get_user_by_id(user_id)
        if not existing_user:
            raise ValueError("User not found")

        return await UserSQL.delete_user(user_id)

    async def soft_delete_user(self, user_id: int):
        existing_user = await UserSQL.get_user_by_id(user_id)
        if not existing_user:
            raise ValueError("User not found")

        user = await UserSQL.soft_delete_user(user_id)
        if not user:
            return None
        return self.map_to_response(user)

    async def search_users(self, keyword: str):
        users = await UserSQL.search_users(keyword)
        return [self.map_to_response(user) for user in users]

    def map_to_response(self, user: dict) -> dict:
        return {
            "id": user["id"],
            "email": user["email"],
            "username": user["username"],
            "full_name": user["full_name"],
            "avatar_url": user["avatar_url"],
            "bio": user["bio"],
            "role": user["role"],
            "is_active": user["is_active"],
            "created_at": user["created_at"],
            "updated_at": user["updated_at"],
        }


user_service = UserService()
