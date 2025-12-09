from ..model.dao.usersdao import UserDAO
from ..model.dto.usersdto import UserDTO
import sqlite3

class UserController:
    @staticmethod
    def signup(data):
        name = data.get('name')
        gender = data.get('gender')
        phone = data.get('phone')
        email = data.get('email')
        terms_agreed = data.get('termsAgreed')

        # validation
        if not all([name, gender, phone, email]):
            return {'success': False, 'message': '모든 필드를 입력해주세요.', 'code': 400}
        
        if not terms_agreed:
            return {'success': False, 'message': '약관에 동의해야 합니다.', 'code': 400}

        try:
            # Create DTO
            new_user = UserDTO(
                userNum=None,
                userName=name,
                userGender=gender,
                userPhone=phone,
                userEmail=email,
                termsAgreed=terms_agreed
            )
            
            UserDAO.create_user(new_user)
            return {'success': True, 'message': '회원가입이 완료되었습니다.', 'code': 200}
        
        except sqlite3.IntegrityError as e:
            # Check specifically for duplicate entries
            # SQLite messages vary, but usually contain 'UNIQUE constraint failed'
            err_msg = str(e)
            if 'UNIQUE constraint failed' in err_msg or 'users.userPhone' in err_msg or 'users.userEmail' in err_msg:
                 return {'success': False, 'message': '이미 존재하는 전화번호나 이메일입니다.', 'code': 409}
            
            return {'success': False, 'message': f'데이터베이스 오류: {err_msg}', 'code': 500}
        
        except Exception as e:
            return {'success': False, 'message': str(e), 'code': 500}
