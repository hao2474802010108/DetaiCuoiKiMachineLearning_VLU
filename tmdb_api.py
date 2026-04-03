import requests

API_KEY = "bfb4fafd7292e270ea2978967fa8312a"
cache = {}

def get_poster(title):
    title = title.split("(")[0].strip()

    if title in cache:
        return cache[title]

    url = f"https://api.themoviedb.org/3/search/movie?api_key={API_KEY}&query={title}"
    res = requests.get(url).json()

    try:
        poster = "https://image.tmdb.org/t/p/w500" + res["results"][0]["poster_path"]
    except:
        poster = "https://via.placeholder.com/300x450?text=No+Image"

    cache[title] = poster
    return poster