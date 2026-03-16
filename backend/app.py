from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import string
import random
from database import db
from models import URL, ClickEvent

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///urls.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)


def generate_code(length=6):
    chars = string.ascii_letters + string.digits
    return "".join(random.choices(chars, k=length))


@app.route("/api/urls", methods=["POST"])
def create_short_url():
    data = request.json
    original_url = data.get("url")

    if not original_url:
        return jsonify({"error": "URL is required"}), 400

    code = generate_code()
    while URL.query.filter_by(short_code=code).first():
        code = generate_code()

    new_url = URL(original_url=original_url, short_code=code)
    db.session.add(new_url)
    db.session.commit()

    return jsonify(new_url.to_dict()), 201


@app.route("/api/urls", methods=["GET"])
def get_urls():
    urls = URL.query.order_by(URL.created_at.desc()).all()
    return jsonify([u.to_dict() for u in urls])


@app.route("/api/urls/<int:url_id>/analytics", methods=["GET"])
def get_analytics(url_id):
    url_entry = URL.query.get_or_404(url_id)
    events = ClickEvent.query.filter_by(url_id=url_id).order_by(ClickEvent.clicked_at.desc()).all()
    return jsonify({
        "url": url_entry.to_dict(),
        "click_events": [e.to_dict() for e in events],
    })


@app.route("/<short_code>")
def resolve_redirect(short_code):
    url_entry = URL.query.filter_by(short_code=short_code).first_or_404()
    url_entry.click_count += 1
    click_event = ClickEvent(url_id=url_entry.id)
    db.session.add(click_event)
    db.session.commit()
    return redirect(url_entry.original_url)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        # Run seed data if DB is empty
        if URL.query.count() == 0:
            from seed_data import seed
            seed()
    app.run(debug=True, port=5000)
