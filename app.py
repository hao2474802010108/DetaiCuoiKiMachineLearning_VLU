from flask import Flask, request, jsonify, render_template
from model import recommend
import requests
import os

app = Flask(__name__)

TMDB_API_KEY = "bfb4fafd7292e270ea2978967fa8312a"

# dịch tiếng Việt
def translate_text(text):
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": "en",
        "tl": "vi",
        "dt": "t",
        "q": text
    }
    res = requests.get(url, params=params).json()
    return res[0][0][0] if res else text

# lấy poster
def get_poster(title):
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={title}"
    res = requests.get(url).json()

    if res["results"]:
        poster_path = res["results"][0]["poster_path"]
        if poster_path:
            return "https://image.tmdb.org/t/p/w500" + poster_path
    return ""

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/recommend", methods=["POST"])
def get_recommend():
    movie = request.json["movie"]
    recs = recommend(movie)

    result = []
    for m in recs:
        result.append({
            "title": m,
            "poster": get_poster(m)
        })

    return jsonify(result)

@app.route("/movie")
def movie_page():
    return render_template("detail.html")

@app.route("/api/movie")
def movie_api():
    title = request.args.get("title")

    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={title}"
    res = requests.get(url).json()

    if res["results"]:
        m = res["results"][0]

        overview_vi = translate_text(m["overview"])

        genre_map = {
            28:"Hành động", 12:"Phiêu lưu", 16:"Hoạt hình",
            35:"Hài", 80:"Tội phạm", 99:"Tài liệu",
            18:"Chính kịch", 10751:"Gia đình", 14:"Giả tưởng",
            36:"Lịch sử", 27:"Kinh dị", 10402:"Âm nhạc",
            9648:"Bí ẩn", 10749:"Lãng mạn", 878:"Khoa học viễn tưởng",
            53:"Gây cấn", 10752:"Chiến tranh"
        }

        genres = [genre_map.get(gid, "") for gid in m["genre_ids"]]

        return jsonify({
            "title": m["title"],
            "overview": overview_vi,
            "poster": "https://image.tmdb.org/t/p/w500" + str(m["poster_path"]),
            "release": m["release_date"],
            "genres": genres
        })

    return jsonify({})
user_history = {}

@app.route("/save_history", methods=["POST"])
def save_history():
    movie = request.json["movie"]

    if "user" not in user_history:
        user_history["user"] = []

    user_history["user"].append(movie)

    return jsonify({"status": "ok"})
@app.route("/get_history")
def get_history():
    history = user_history.get("user", [])
    return jsonify(history)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)