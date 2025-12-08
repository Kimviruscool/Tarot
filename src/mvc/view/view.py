from flask import Blueprint, render_template

bp = Blueprint('main', __name__, url_prefix='/')

@bp.route('/choice')
def home():
    return render_template('choice.html')
