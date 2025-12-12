from firebase_admin import firestore
from ..dto.usersdto import UserDTO

# db = firestore.client()  <-- 이 줄이 밖에 있어서 에러가 났던 겁니다. 지우세요.

class UserDAO:
    @staticmethod
    def create_user(user_dto):
        db = firestore.client() # <-- 이렇게 함수 안에서 연결하도록 변경!
        try:
            users_ref = db.collection('users')
            # 이메일 중복 확인
            # stream()은 리스트로 변환해서 체크
            docs = users_ref.where('userEmail', '==', user_dto.userEmail).stream()
            if any(docs):
                 return {'success': False, 'message': '이미 가입된 이메일입니다.', 'code': 409}

            doc_ref = users_ref.document()
            user_data = {
                'userName': user_dto.userName,
                'userGender': user_dto.userGender,
                'userPhone': user_dto.userPhone,
                'userEmail': user_dto.userEmail,
                'termsAgreed': user_dto.termsAgreed,
                'isPremium': False,
                'created_at': firestore.SERVER_TIMESTAMP
            }
            doc_ref.set(user_data)
            return {'success': True, 'message': '가입 성공', 'code': 200}
        except Exception as e:
            return {'success': False, 'message': str(e), 'code': 500}