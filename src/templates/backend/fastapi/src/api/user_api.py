from fastapi import APIRouter, HTTPException, status
from src.service.user_service import user_service
from src.types.user_type import CreateUserDto, UpdateUserDto, ApiResponse
from src.function.helper import validate_create_user_dto, validate_update_user_dto, validate_string

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=ApiResponse)
async def get_all_users():
    try:
        users = await user_service.get_all_users()
        return ApiResponse(
            success=True,
            data=users,
            message="Users retrieved successfully",
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/{user_id}", response_model=ApiResponse)
async def get_user_by_id(user_id: int):
    try:
        if user_id <= 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")

        user = await user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        return ApiResponse(
            success=True,
            data=user,
            message="User retrieved successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/search/{keyword}", response_model=ApiResponse)
async def search_users(keyword: str):
    try:
        if not validate_string(keyword, 1, 100):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Search keyword must be between 1 and 100 characters")

        users = await user_service.search_users(keyword)
        return ApiResponse(
            success=True,
            data=users,
            message="Users retrieved successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
async def create_user(data: dict):
    try:
        validated_data = validate_create_user_dto(data)
        user = await user_service.create_user(validated_data)
        return ApiResponse(
            success=True,
            data=user,
            message="User created successfully",
        )
    except ValueError as e:
        error_message = str(e)
        if "already exists" in error_message or "already taken" in error_message:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=error_message)
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_message)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.put("/{user_id}", response_model=ApiResponse)
async def update_user(user_id: int, data: dict):
    try:
        if user_id <= 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")

        validated_data = validate_update_user_dto(data)
        user = await user_service.update_user(user_id, validated_data)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        return ApiResponse(
            success=True,
            data=user,
            message="User updated successfully",
        )
    except ValueError as e:
        error_message = str(e)
        if "already in use" in error_message or "already taken" in error_message:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=error_message)
        elif "not found" in error_message:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=error_message)
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_message)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{user_id}", response_model=ApiResponse)
async def delete_user(user_id: int):
    try:
        if user_id <= 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")

        deleted = await user_service.delete_user(user_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        return ApiResponse(
            success=True,
            message="User deleted successfully",
        )
    except ValueError as e:
        error_message = str(e)
        if "not found" in error_message:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=error_message)
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_message)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/{user_id}/soft-delete", response_model=ApiResponse)
async def soft_delete_user(user_id: int):
    try:
        if user_id <= 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")

        user = await user_service.soft_delete_user(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        return ApiResponse(
            success=True,
            data=user,
            message="User soft deleted successfully",
        )
    except ValueError as e:
        error_message = str(e)
        if "not found" in error_message:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=error_message)
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_message)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
