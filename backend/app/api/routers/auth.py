from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import Token, ForgotPassword, ResetPassword
from app.core.security import get_password_hash, verify_password, create_access_token, create_reset_token, verify_reset_token, get_current_user
from app.core.email import send_reset_password_email
from fastapi.security import OAuth2PasswordRequestForm
import uuid

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalars().first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    mobile = user_in.mobile_number
    if mobile:
        result = await db.execute(select(User).where(User.mobile_number == mobile))
        existing_mobile = result.scalars().first()
        if existing_mobile:
            raise HTTPException(status_code=400, detail="Mobile number already registered")
    else:
        mobile = f"dummy_{uuid.uuid4()}"
        
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        mobile_number=mobile,
        full_name=user_in.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forgot-password")
async def forgot_password(data: ForgotPassword, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalars().first()
    if not user:
        return {"msg": "If an account with this email exists, a password reset link has been sent."}
        
    reset_token = create_reset_token(email=user.email)
    background_tasks.add_task(send_reset_password_email, user.email, reset_token)
    return {"msg": "If an account with this email exists, a password reset link has been sent."}

@router.post("/reset-password")
async def reset_password(data: ResetPassword, db: AsyncSession = Depends(get_db)):
    email = verify_reset_token(data.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.hashed_password = get_password_hash(data.new_password)
    await db.commit()
    return {"msg": "Password updated successfully"}
    
@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
