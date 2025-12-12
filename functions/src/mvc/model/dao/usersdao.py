from firebase_admin import firestore
from ..dto.usersdto import UserDTO

db = firestore.client()

class UserDAO:
    @staticmethod
    def create_user(user_dto):
        try:
            users_ref = db.collection('users')
            # 이메일 중복 확인
            if len(users_ref.where('userEmail', '==', user_dto.userEmail).get()) > 0:
                 return {'error': '이미 가입된 이메일입니다.'}

            doc_ref = users_ref.document()
            user_data = {
                'userName': user_dto.userName,
                'userGender': user_dto.userGender,
                'userPhone': user_dto.userPhone,
                'userEmail': user_dto.userEmail,
                'termsAgreed': user_dto.termsAgreed,
                'isPremium': False, # 수익화용 필드
                'created_at': firestore.SERVER_TIMESTAMP
            }
            doc_ref.set(user_data)
            return doc_ref.id
        except Exception as e:
            raise e