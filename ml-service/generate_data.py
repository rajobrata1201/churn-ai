import pandas as pd
import numpy as np
import os

os.makedirs("data/train", exist_ok=True)
os.makedirs("data/test", exist_ok=True)

def generate_dataset(n):
    data = []

    for _ in range(n):
        weekly_watch_time = np.random.randint(0, 30)

        watch_time_delta = np.random.uniform(-1, 1)

        plan = np.random.randint(0, 3)

        downgrade = np.random.binomial(1, 0.2)

        payment_delay = np.random.randint(0, 10)

        missed_payment = np.random.randint(0, 3)

        inactivity = np.random.randint(0, 30)

        region = np.random.randint(0, 5)

        economic = np.random.uniform(0, 1)

        # REALISTIC CHURN LOGIC
        churn_score = (
            (1 - weekly_watch_time / 30) * 0.3 +
            (1 if watch_time_delta < -0.3 else 0) * 0.2 +
            (downgrade * 0.2) +
            (payment_delay / 10) * 0.2 +
            (missed_payment * 0.1) +
            (inactivity / 30) * 0.2 +
            (1 - economic) * 0.1
        )

        churn = 1 if churn_score > 0.6 else 0

        data.append([
            weekly_watch_time,
            watch_time_delta,
            plan,
            downgrade,
            payment_delay,
            missed_payment,
            inactivity,
            region,
            economic,
            churn
        ])

    cols = [
        "weekly_watch_time",
        "watch_time_delta_percentage",
        "current_plan_encoded",
        "downgrade_flag",
        "payment_delay_days",
        "missed_payment_count",
        "days_since_last_activity",
        "region_encoded",
        "economic_index",
        "churn"
    ]

    return pd.DataFrame(data, columns=cols)


# 🔥 GENERATE MANY FILES
for i in range(10):
    df = generate_dataset(1000)
    df.to_excel(f"data/train/train_{i}.xlsx", index=False)

for i in range(5):
    df = generate_dataset(300)
    df.drop(columns=["churn"]).to_excel(f"data/test/test_{i}.xlsx", index=False)

print("DATA GENERATED")