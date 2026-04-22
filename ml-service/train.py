import pandas as pd
import os
from xgboost import XGBClassifier
import pickle

train_files = os.listdir("data/train")

dfs = []

for f in train_files:
    df = pd.read_excel(f"data/train/{f}")
    dfs.append(df)

df = pd.concat(dfs, ignore_index=True)

X = df.drop(columns=["churn"])
y = df["churn"]

model = XGBClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8
)

model.fit(X, y)

os.makedirs("models", exist_ok=True)

with open("models/model.pkl", "wb") as f:
    pickle.dump(model, f)

print("MODEL TRAINED")

import pickle

with open("models/features.pkl", "wb") as f:
    pickle.dump(X.columns.tolist(), f)