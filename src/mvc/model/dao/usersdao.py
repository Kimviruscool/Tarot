from ..db import get_db
from ..dto.usersdto import UserDTO
import sqlite3

class UserDAO:
    @staticmethod
    def create_user(user_dto):
        """
        Creates a new user from a UserDTO object.
        """
        db = get_db()
        try:
            cursor = db.cursor()
            cursor.execute(
                "INSERT INTO users (userName, userGender, userPhone, userEmail, termsAgreed) VALUES (?, ?, ?, ?, ?)",
                (
                    user_dto.userName, 
                    user_dto.userGender, 
                    user_dto.userPhone, 
                    user_dto.userEmail, 
                    1 if user_dto.termsAgreed else 0
                )
            )
            db.commit()
            return cursor.lastrowid
        except sqlite3.IntegrityError as e:
            db.rollback()
            raise e
        finally:
            cursor.close()

    @staticmethod
    def get_user_by_phone(phone):
        db = get_db()
        cursor = db.execute("SELECT * FROM users WHERE userPhone = ?", (phone,))
        row = cursor.fetchone()
        return UserDTO.from_row(row)

    @staticmethod
    def get_user_by_email(email):
        db = get_db()
        cursor = db.execute("SELECT * FROM users WHERE userEmail = ?", (email,))
        row = cursor.fetchone()
        return UserDTO.from_row(row)
