import os
import joblib
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler

def bootstrap():
    model_dir = os.path.join(os.path.dirname(__file__), "Reserve_data")
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)

    model_path = os.path.join(model_dir, "reserve_model.h5")
    feature_scaler_path = os.path.join(model_dir, "feature_scaler.pkl")
    target_scaler_path = os.path.join(model_dir, "target_scaler.pkl")

    # Create dummy scalers if missing
    if not os.path.exists(feature_scaler_path):
        scaler = StandardScaler()
        # Mock fit with dummy data (15 features)
        scaler.fit(np.random.rand(10, 15))
        joblib.dump(scaler, feature_scaler_path)
        print(f"Created dummy feature scaler at {feature_scaler_path}")

    if not os.path.exists(target_scaler_path):
        scaler = StandardScaler()
        # Mock fit with dummy data (2 targets: claims, payout)
        scaler.fit(np.random.rand(10, 2))
        joblib.dump(scaler, target_scaler_path)
        print(f"Created dummy target scaler at {target_scaler_path}")

    # Create dummy LSTM model if missing
    if not os.path.exists(model_path):
        # Sequence input: 14 days, 15 features
        # Output: 7 days, 2 predictions per day
        model = tf.keras.Sequential([
            tf.keras.layers.Input(shape=(14, 15)),
            tf.keras.layers.LSTM(32, return_sequences=True),
            tf.keras.layers.LSTM(16),
            tf.keras.layers.Dense(14), # 7 days * 2 targets
            tf.keras.layers.Reshape((7, 2))
        ])
        model.compile(optimizer='adam', loss='mse')
        model.save(model_path)
        print(f"Created dummy Reserve LSTM model at {model_path}")

if __name__ == "__main__":
    bootstrap()
