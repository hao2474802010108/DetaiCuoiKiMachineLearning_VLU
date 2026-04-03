from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

def build_cf_model(ratings):
    matrix = ratings.pivot_table(index="user_id", columns="movie_id", values="rating").fillna(0)
    similarity = cosine_similarity(matrix)
    return matrix, similarity

def build_content_model(movies):
    tfidf = TfidfVectorizer(stop_words="english")
    movies["genres"] = movies["genres"].str.replace("|", " ")
    tfidf_matrix = tfidf.fit_transform(movies["genres"])
    similarity = cosine_similarity(tfidf_matrix)
    return similarity

def recommend(user_id, ratings, movies, matrix, cf_sim, content_sim, top_n=8):
    watched = ratings[ratings["user_id"] == user_id]["movie_id"].tolist()

    idx = user_id - 1
    sim_users = list(enumerate(cf_sim[idx]))
    sim_users = sorted(sim_users, key=lambda x: x[1], reverse=True)[1:6]
    similar_users = [u[0] for u in sim_users]

    cf_scores = matrix.iloc[similar_users].mean().sort_values(ascending=False)

    content_scores = {}
    for movie_id in watched:
        try:
            idx_movie = movies[movies["movie_id"] == movie_id].index[0]
            sim_movies = list(enumerate(content_sim[idx_movie]))
            sim_movies = sorted(sim_movies, key=lambda x: x[1], reverse=True)[1:10]

            for m in sim_movies:
                m_id = movies.iloc[m[0]]["movie_id"]
                content_scores[m_id] = content_scores.get(m_id, 0) + m[1]
        except:
            continue

    final_scores = dict(cf_scores)

    for m, s in content_scores.items():
        final_scores[m] = final_scores.get(m, 0) + s

    for w in watched:
        final_scores.pop(w, None)

    sorted_movies = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)

    return [m[0] for m in sorted_movies[:top_n]]