from firebase_functions import https_fn
from firebase_admin import initialize_app
from src import create_app

initialize_app()
app = create_app()

@https_fn.on_request()
def tarotapp(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()