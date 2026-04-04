import pandas as pd
import ast
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

movies = pd.read_csv("data/tmdb_5000_movies.csv")
credits = pd.read_csv("data/tmdb_5000_credits.csv")

movies = movies.merge(credits, on="title")

def get_names(text):
    names = []
    for i in ast.literal_eval(text):
        names.append(i["name"])
    return " ".join(names)

def get_director(text):
    for i in ast.literal_eval(text):
        if i["job"] == "Director":
            return i["name"]
    return ""

movies["genres"] = movies["genres"].apply(get_names)
movies["keywords"] = movies["keywords"].apply(get_names)
movies["cast"] = movies["cast"].apply(get_names)
movies["director"] = movies["crew"].apply(get_director)

movies["content"] = (
    movies["genres"] + " " +
    movies["keywords"] + " " +
    movies["cast"] + " " +
    movies["director"] + " " +
    movies["overview"]
)

movies = movies[["title", "content"]]
movies.dropna(inplace=True)

tfidf = TfidfVectorizer(stop_words="english")
matrix = tfidf.fit_transform(movies["content"])

similarity = cosine_similarity(matrix)

def recommend(movie_name):
    movie_name = movie_name.lower()

    matches = movies[movies["title"].str.lower().str.contains(movie_name)]

    if len(matches) == 0:
        return []

    idx = matches.index[0]

    scores = list(enumerate(similarity[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)

    result = []
    for i in scores[1:11]:
        result.append(movies.iloc[i[0]]["title"])

    return result