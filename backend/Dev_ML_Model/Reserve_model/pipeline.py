import os
import joblib
import numpy as np
import tensorflow as tf
import pandas as pd

class ReservePipeline:
    def __init__(self):
        self.model_dir = os.path.join(os.path.dirname(__file__), "Reserve_data")
        self.model_path = os.path.join(self.model_dir, "reserve_model.h5")
        self.feature_scaler_path = os.path.join(self.model_dir, "feature_scaler.pkl")
        self.target_scaler_path = os.path.join(self.model_dir, "target_scaler.pkl")
        
        # Load assets
        try:
            self.model = tf.keras.models.load_model(self.model_path)
            self.feature_scaler = joblib.load(self.feature_scaler_path)
            self.target_scaler = joblib.load(self.target_scaler_path)
            print("Successfully loaded Reserve Forecasting LSTM model and scalers.")
        except Exception as e:
            print(f"Error loading model assets: {e}")
            self.model = None

    def generate_dummy_sequence(self):
        """Generates a dummy 14-day sequence for testing if no historical data is provided"""
        # (1, 14, 15) shape: 1 sample, 14 days lookback, 15 features
        return np.random.rand(1, 14, 15)

    def predict_reserve_needs(self, historical_data=None):
        """
        Input: historical_data (dataframe or array of shape (14, 15))
        Output: (predicted_claims_7d, predicted_payout_7d)
        """
        if self.model is None:
            return 0, 0
            
        if historical_data is None:
            # For demo: use dummy data if real sequence isn't provided
            sequence = self.generate_dummy_sequence()
        else:
            # Scale historical data
            sequence = self.feature_scaler.transform(historical_data)
            sequence = sequence.reshape(1, 14, 15)

        # Predict (Shape will be (1, 7, 2))
        prediction_scaled = self.model.predict(sequence)
        
        # Inverse scale (Need to handle the 7-day window)
        # Reshape to (7, 2) then inverse scale
        predicted_values = self.target_scaler.inverse_transform(prediction_scaled[0])
        
        # Aggregate for the 7-day window
        total_claims = int(np.sum(predicted_values[:, 0]))
        total_payout = float(np.sum(predicted_values[:, 1]))
        
        return total_claims, total_payout

# Singleton instance
pipeline = ReservePipeline()
