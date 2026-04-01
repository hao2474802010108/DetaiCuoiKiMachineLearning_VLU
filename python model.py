import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle
# đọc dữ liệu
df = pd.read_csv("data.csv", sep=";")
print(df.head())  # check
X = df["comment"]
y = df["label"]
# vector hóa
vectorizer = TfidfVectorizer()
X_vector = vectorizer.fit_transform(X)
# train
model = LogisticRegression(max_iter=1000)
model.fit(X_vector, y)
# lưu
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))
print("Train xong!")