from flask import Flask


def create_app():
    app = Flask(__name__)

    # 시크릿 키 설정
    app.config['SECRET_KEY'] = 'dev'

    # [수정됨] 여기에 있던 db.init_app(app), db.init_db() 코드를 모두 지웠습니다.
    # 이제 Firestore를 사용하므로 파일 DB 설정은 필요 없습니다.

    from .mvc.view.view import bp
    app.register_blueprint(bp)

    return app