from firebase_functions import https_fn
from firebase_admin import initialize_app
from src import create_app
import os
from dotenv import load_dotenv

# .env file load
load_dotenv()

initialize_app()
app = create_app()

@https_fn.on_request(region="asia-northeast3",secrets=["PORTONE_API_KEY","PORTONE_API_SECRET"])
def tarotapp(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()