import os
from flask import Blueprint, render_template, send_from_directory, current_app, redirect, url_for, request, jsonify
from ..controller.user_controller import UserController
import requests
from firebase_admin import firestore

bp = Blueprint('main', __name__, url_prefix='/')

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/choice')
def home():
    return render_template('choice.html')

@bp.route('/cards/<path:filename>')
def cards(filename):
    # 'src' is the root_path of the app. 'card' is in the parent of 'src'.
    card_dir = os.path.join(os.path.dirname(current_app.root_path), 'cards')
    return send_from_directory(card_dir, filename)

@bp.route('/daily_fortune')
def daily_fortune():
    return render_template('daily_fortune.html')

@bp.route('/today_love')
def today_love():
    return render_template('today_love.html')

@bp.route('/today_wealth')
def today_wealth():
    return render_template('today_wealth.html')

@bp.route('/today_color')
def today_color():
    return render_template('today_color.html')

@bp.route('/month_fortune')
def month_fortune():
    return render_template('month_fortune.html')

@bp.route('/month_love')
def month_love():
    return render_template('month_love.html')

@bp.route('/month_wealth')
def month_wealth():
    return render_template('month_wealth.html')

@bp.route('/login')
def login():
    return render_template('login.html')

@bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        result = UserController.signup(request.json)
        return jsonify({'success': result['success'], 'message': result['message']}), result['code']
    
    return render_template('signup.html')

@bp.route('/terms')
def terms():
    terms_content = ""
    try:
        # Assuming the file is in the root directory 'Tarot' which is the parent of 'src'
        root_path = os.path.dirname(current_app.root_path)
        terms_path = os.path.join(root_path, '약관동의서.txt')
        with open(terms_path, 'r', encoding='utf-8') as f:
            terms_content = f.read()
    except Exception as e:
        terms_content = "약관을 불러올 수 없습니다. 관리자에게 문의하세요."
    return render_template('terms.html', terms_content=terms_content)

@bp.route('/payment/verify', method=['POST'])
def verify_payment():
    data = request.json
    imp_uid = data.get('imp_uid')
    merchant_uid = data.get('merchant_uid')

    #PORTONE API
    api_key = os.getenv("PORTONE_API_KEY")
    api_secret = os.getenv("PORTONE_API_SECRET")

    try :
        #Access Token 발급 요청
        token_response = requests.post("https://api.iamport.kr/users/getToken", json={"import_key":api_key, "import_secret_key":api_secret}).json()
        access_token = token_response['response']['access_token']

        #결제 정보 조회
        payment_response = requests.get(f"https://api.iamport.kr/payments/{imp_uid}",headers={"Authorization":access_token}).json()
        payment_data = payment_response['response']

        #결제 검증 및 firestore 저장
        if payment_data['status'] == 'paid' :
            db = firestore.client()
            db.collection('payments').document(imp_uid).set({
                'merchant_uid': merchant_uid,
                'amount' : payment_data['amount'],
                'buyer_email':payment_data['buyer_email'],
                'status':'success',
                'created_at':firestore.SERVER_TIMESTAMP
            })
            return jsonify({'success':True, 'message':'결제 검증 완료'}), 200
        else :
            return jsonify({'success':False, 'message':'결제되지 않은 요청입니다.'}),400

    except Exception as e:
        print(e)
        return jsonify({'success':False, 'message':str(e)}), 500