from flask import Flask, request, jsonify, render_template
from data_loader import load_data
from model import build_cf_model, build_content_model, recommend
from tmdb_api import get_poster

app = Flask(__name__)

users, movies, ratings = load_data()

matrix, cf_sim = build_cf_model(ratings)
content_sim = build_content_model(movies)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/recommend")
def get_recommend():
    user_id = int(request.args.get("user_id"))

    movie_ids = recommend(user_id, ratings, movies, matrix, cf_sim, content_sim)
    result = movies[movies["movie_id"].isin(movie_ids)]

    data = []
    for _, row in result.iterrows():
        data.append({
            "title": row["title"],
            "poster": get_poster(row["title"])
        })

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)