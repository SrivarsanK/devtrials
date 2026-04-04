import pandas as pd
import numpy as np
import joblib
import os
from xgboost import XGBClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

# Create exports directory
export_path = os.path.abspath("../exports")
os.makedirs(export_path, exist_ok=True)

print(f"Bootstrapping model artifacts to {export_path}...")

# 1. Create a dummy zone lookup (Section 1)
p1_zones = ["Velachery", "Kolathur", "Perumbakkam"]
p2_zones = ["Guindy", "Perungudi", "Meenambakkam"]
p3_zones = ["Adyar", "Mylapore", "T Nagar"]

zones = []
for name in p1_zones: zones.append({"zone_name": name, "zone_priority": 1, "zone_cluster_id": 0, "zone_score_offset": 0.10, "zone_fraud_baseline": 0.28})
for name in p2_zones: zones.append({"zone_name": name, "zone_priority": 2, "zone_cluster_id": 1, "zone_score_offset": 0.00, "zone_fraud_baseline": 0.14})
for name in p3_zones: zones.append({"zone_name": name, "zone_priority": 3, "zone_cluster_id": 2, "zone_score_offset": -0.05, "zone_fraud_baseline": 0.07})

df_zones = pd.DataFrame(zones)
df_zones.to_csv(os.path.join(export_path, "zone_priority_lookup.csv"), index=False)

# 2. Create and Save Scaler (Section 4)
# We need to simulate the column names/order for the final model
# Current app features (~25 columns)
dummy_features = pd.DataFrame(np.random.rand(10, 30)) # 30 cols to match engineered features
scaler = StandardScaler()
scaler.fit(dummy_features)
joblib.dump(scaler, os.path.join(export_path, "scaler_RideSuraksha.pkl"))

# 3. Create and Save XGBoost (Section 13)
xgb_model = XGBClassifier(n_estimators=10)
y_dummy = np.random.randint(0, 2, 10)
xgb_model.fit(dummy_features, y_dummy)
xgb_model.save_model(os.path.join(export_path, "xgb_model_RideSuraksha.json"))

# 4. Create and Save LightGBM (Section 13)
# Creating a text booster file
import lightgbm as lgb
lgbm_model = lgb.LGBMClassifier(n_estimators=10)
lgbm_model.fit(dummy_features, y_dummy)
lgbm_model.booster_.save_model(os.path.join(export_path, "lgbm_model_RideSuraksha.txt"))

print("Bootstrap complete. All artifacts generated in /exports/.")
