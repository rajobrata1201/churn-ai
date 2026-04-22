import pandas as pd
import glob
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle

files = glob.glob("data/train/*.xlsx")

df_list = [pd.read_excel(f) for f in files]
df = pd.concat(df_list, ignore_index=True)

X = df.drop("churn", axis=1)
y = df["churn"]

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2)

model = xgb.XGBClassifier(n_estimators=150, max_depth=5)
model.fit(X_train, y_train)

preds = model.predict(X_val)
acc = accuracy_score(y_val, preds)

print("Validation Accuracy:", acc)

# SAVE MODEL
with open("models/model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model saved")