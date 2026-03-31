from sklearn.datasets import load_iris

data = load_iris()
X = data.data
y = data.target

print(X[:5])
print(y[:5])