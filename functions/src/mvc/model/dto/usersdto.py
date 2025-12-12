from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class UserDTO:
    userNum: Optional[int]
    userName: str
    userGender: str
    userPhone: str
    userEmail: str
    termsAgreed: bool
    created_at: Optional[datetime] = None

    @staticmethod
    def from_row(row):
        if not row:
            return None
        return UserDTO(
            userNum=row['userNum'],
            userName=row['userName'],
            userGender=row['userGender'],
            userPhone=row['userPhone'],
            userEmail=row['userEmail'],
            termsAgreed=bool(row['termsAgreed']),
            created_at=row['created_at']
        )
