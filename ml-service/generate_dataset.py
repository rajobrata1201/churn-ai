import pandas as pd
import numpy as np
import os

def create_dataset(n):
    data = {
        "weekly_watch_time": np.random.randint(1, 20, n),
        "watch_time_delta_percentage": np.random.uniform(-1, 1, n),
        "current_plan_encoded": np.random.randint(0, 3, n),
        "downgrade_flag": np.random.randint(0, 2, n),
        "payment_delay_days": np.random.randint(0, 10, n),
        "missed_payment_count": np.random.randint(0, 3, n),
        "days_since_last_activity": np.random.randint(0, 30, n),
        "region_encoded": np.random.randint(0, 5, n),
        "economic_index": np.random.uniform(0, 1, n),
    }

    df = pd.DataFrame(data)

    score = (
        (df["watch_time_delta_percentage"] < -0.3).astype(int) +
        (df["downgrade_flag"] == 1).astype(int) +
        (df["payment_delay_days"] > 5).astype(int) +
        (df["days_since_last_activity"] > 10).astype(int)
    )

    df["churn"] = (score >= 2).astype(int)

    return df

# create datasets
os.makedirs("data/train", exist_ok=True)
os.makedirs("data/test", exist_ok=True)

for i in range(5):
    df = create_dataset(300)
    df.to_excel(f"data/train/train_{i}.xlsx", index=False)

for i in range(2):
    df = create_dataset(100)
    df.to_excel(f"data/test/test_{i}.xlsx", index=False)

print("Datasets created")