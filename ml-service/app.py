from flask import Flask, request, jsonify
import pandas as pd
import pickle
import shap

app = Flask(__name__)

# LOAD MODEL ONCE
with open("models/model.pkl", "rb") as f:
    model = pickle.load(f)
with open("models/features.pkl", "rb") as f:
    FEATURES = pickle.load(f)
import hashlib

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["file"]
    df = pd.read_excel(file)

    required_cols = [
        "weekly_watch_time",
        "watch_time_delta_percentage",
        "current_plan_encoded",
        "downgrade_flag",
        "payment_delay_days",
        "missed_payment_count",
        "days_since_last_activity",
        "region_encoded",
        "economic_index",
    ]

    try:
        # Keep only required columns
        df = df.copy()

        for col in FEATURES:
            if col not in df.columns:
                df[col] = 0

        df = df[FEATURES]

        # Ensure numeric
        df = df.apply(pd.to_numeric)

        # Predict
        import numpy as np

        probs = model.predict_proba(df)[:, 1]

# spread probabilities (prevents clustering at 1.0)
        probs = np.power(probs, 0.6)

# ensure bounds
        probs = np.clip(probs, 0, 1)

        # SHAP
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(df)

        results = []
        for i in range(len(df)):
            impacts = list(zip(required_cols, shap_values[i]))

# sort by absolute impact
            impacts.sort(key=lambda x: abs(x[1]), reverse=True)

            top = [
                {
                    "feature": feat,
                    "impact": float(val)
                }
                for feat, val in impacts[:3]
            ]

            results.append({
                "user_id": str(i),
                "churn_probability": float(probs[i]),
                "top_factors": top
            })

        # sort highest risk first
        results.sort(key=lambda x: x["churn_probability"], reverse=True)

        return jsonify(results)

    except Exception as e:
        print("ML ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8000)