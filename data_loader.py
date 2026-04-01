import pandas as pd

def load_data():
    users = pd.read_csv("data/users.dat", sep="::", engine="python",
                        names=["user_id","gender","age","occupation","zip"])

    movies = pd.read_csv("data/movies.dat", sep="::", engine="python",
                         names=["movie_id","title","genres"],
                         encoding="latin-1")

    ratings = pd.read_csv("data/ratings.dat", sep="::", engine="python",
                          names=["user_id","movie_id","rating","timestamp"])

    return users, movies, ratings