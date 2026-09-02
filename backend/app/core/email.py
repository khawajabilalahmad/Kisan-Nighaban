from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("SMTP_EMAIL", "example@gmail.com"),
    MAIL_PASSWORD = os.getenv("SMTP_PASSWORD", "password"),
    MAIL_FROM = os.getenv("SMTP_EMAIL", "example@gmail.com"),
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

async def send_reset_password_email(email_to: str, token: str):
    reset_link = f"http://localhost:5173/reset-password?token={token}"
    
    html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Password Reset Request</h2>
        <p>You recently requested to reset your password for your Kisan Nighaban account.</p>
        <p>Click the button below to reset it:</p>
        <a href="{reset_link}" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Reset Password</a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">If you did not request a password reset, please ignore this email.</p>
    </div>
    """

    message = MessageSchema(
        subject="Kisan Nighaban - Password Reset",
        recipients=[email_to],
        body=html,
        subtype="html"
    )

    # Note: If email credentials are empty/default, we print to console so it still works in dev
    if os.getenv("SMTP_EMAIL") is None or os.getenv("SMTP_EMAIL") == "example@gmail.com":
        print(f"\n========== MOCK EMAIL ==========\nTo: {email_to}\nLink: {reset_link}\n================================\n")
        return

    fm = FastMail(conf)
    try:
        await fm.send_message(message)
    except Exception as e:
        print(f"Failed to send email: {e}")
