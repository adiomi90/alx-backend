#!/usr/bin/env python3
""" Flask app """

from flask import (
    Flask,
    render_template,
    request
)
from flask_babel import Babel


class Config(object):
    """Configuration class for Flask app"""
    
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """Function to determine the best matching locale for the user"""
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/', strict_slashes=False)
def index() -> str:
    """Route handler for the home page"""
    return render_template('3-index.html')


if __name__ == "__main__":
    app.run(port="5000", host="0.0.0.0", debug=True)
