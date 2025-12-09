from flask import Flask
import os
from .mvc.model import db

def create_app():
    app = Flask(__name__)

    # Configuration can be moved to a config file
    app.config['SECRET_KEY'] = 'dev'
    app.config['DATABASE'] = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'DB', 'tarot.db')

    # Initialize Database
    db.init_app(app)

    # Ensure DB exists and tables are created (optional auto-init for dev convenience)
    with app.app_context():
        if not os.path.exists(app.config['DATABASE']):
            db.init_db()

    from .mvc.view.view import bp
    app.register_blueprint(bp)

    return app