import pandas as pd
import numpy as np
import joblib
import json
from xgboost import XGBClassifier
import lightgbm as lgb
import os

class RideSurakshaFraudEngine:
    def __init__(self, model_dir="exports"):
        self.model_dir = model_dir
        self.scaler = None
        self.xgb_model = None
        self.lgbm_model = None
        self.zone_lookup = None
        self.is_loaded = False
        
        # Thresholds from the spec
        self.thresholds = {
            1: {"AUTO_APPROVE": 0.20, "APPROVE_AUDIT": 0.50, "HOLD_24HR": 0.75}, # P1
            2: {"AUTO_APPROVE": 0.30, "APPROVE_AUDIT": 0.60, "HOLD_24HR": 0.80}, # P2
            3: {"AUTO_APPROVE": 0.35, "APPROVE_AUDIT": 0.65, "HOLD_24HR": 0.82}  # P3
        }

    def load_artifacts(self):
        """Loads all trained models and lookup tables."""
        try:
            self.scaler = joblib.load(os.path.join(self.model_dir, "scaler_RideSuraksha.pkl"))
            
            # Load XGBoost (JSON)
            self.xgb_model = XGBClassifier()
            self.xgb_model.load_model(os.path.join(self.model_dir, "xgb_model_RideSuraksha.json"))
            
            # Load LightGBM (txt booster)
            self.lgbm_model = lgb.Booster(model_file=os.path.join(self.model_dir, "lgbm_model_RideSuraksha.txt"))
            
            # Load Zone Lookup
            self.zone_lookup = pd.read_csv(os.path.join(self.model_dir, "zone_priority_lookup.csv"))
            
            self.is_loaded = True
            print("RideSuraksha Engine: All artifacts loaded successfully.")
        except Exception as e:
            print(f"Error loading artifacts: {e}")
            self.is_loaded = False

    def check_hard_rules(self, features):
        """Implement the 10 trip-wire rules (Section 6 of Spec)."""
        rules = [
            (features.get('cell_mismatch_count', 0) >= 4, "impossible_location"),
            (features.get('is_emulator') and features.get('same_device_accounts', 0) > 3, "device_farm"),
            (features.get('vpn_detected') and features.get('cell_mismatch_count', 0) >= 3, "vpn_spoof"),
            (features.get('mock_location_enabled') and features.get('satellite_count', 0) < 4, "gps_spoof"),
            (features.get('same_bank_accounts', 0) > 3 and features.get('same_device_accounts', 0) > 3, "identity_farm"),
            (features.get('zone_priority_mismatch') and features.get('cross_zone_claim') and features.get('account_age_days', 0) < 30, "zone_hopping_new_worker"),
            (features.get('cluster_size_last_24h', 0) > 15 and not features.get('weather_event_confirmed', True), "collusion_ring"),
            (features.get('time_since_sim_change_hrs', 999) < 24 and features.get('cell_mismatch_count', 0) >= 2, "sim_swap"),
            (features.get('behavioral_similarity_score', 1.0) < 0.1 and features.get('orders_during_window', 0) > 0, "borrowed_device"),
            (features.get('location_trust_tier') == 3 and features.get('vpn_detected'), "vpn_wifi_only")
        ]
        
        for condition, reason in rules:
            if condition:
                return True, reason
        return False, "NONE"

    def get_zone_data(self, zone_name):
        """Fetch offsets and priority for a specific zone."""
        if self.zone_lookup is None:
            return 0.0, 2 # Default to P2 (Standard)
        
        res = self.zone_lookup[self.zone_lookup['zone_name'] == zone_name]
        if res.empty:
            return 0.0, 2
        
        offset = res.iloc[0]['zone_score_offset']
        priority = res.iloc[0]['zone_priority']
        return offset, priority

    def create_interaction_features(self, df):
        """Mirror Section 4 Feature Engineering Interaction logic."""
        df['vpn_x_mismatch'] = df.get('vpn_risk_score', 0) * df.get('cell_mismatch_count', 0)
        df['behavior_x_sim'] = df.get('behavioral_similarity_score', 0) * df.get('sim_risk_score', 0)
        df['zone_risk_composite'] = df.get('zone_fraud_baseline', 0) * (1 + df.get('zone_score_offset', 0))
        df['collusion_signal'] = df.get('cluster_suspicious_score', 0) * df.get('cluster_size_last_24h', 0)
        # Handle division by zero for device_trust
        denom = df.get('same_device_accounts', 1).clip(lower=1)
        df['device_trust'] = (1 - df.get('is_emulator', 0).astype(int)) * df.get('satellite_count', 0) * (1 / denom)
        return df

    def score_claim(self, raw_features):
        """The total inference pipeline (Sections 12 and 14)."""
        if not self.is_loaded:
            return {"error": "Model artifacts not loaded"}

        # 1. Check Hard Rules
        hard_flag, hard_reason = self.check_hard_rules(raw_features)
        if hard_flag:
            return {
                "model_score": 0.95,
                "zone_score_offset": 0.0,
                "adjusted_score": 0.95,
                "decision": "REJECT_FREEZE",
                "hard_fail": True,
                "hard_fail_reason": hard_reason,
                "confidence": 1.0
            }

        # 2. Extract Zone Info
        zone_name = raw_features.get("zone_name", "Unknown")
        offset, priority = self.get_zone_data(zone_name)

        # 3. Preprocess for ML
        # (Demo mode: adjusting input feature count to match bootstrap's 30-feature shape)
        ml_input = {}
        for i in range(30):
            ml_input[f"feat_{i}"] = [0.5] # Default values for preview
        
        df = pd.DataFrame(ml_input)
        
        # Scaling
        X_scaled = self.scaler.transform(df)

        # 4. Model Ensemble (XGB 55% + LGBM 45%)
        # For actual prediction, we need the exact feature sequence.
        prob_xgb = self.xgb_model.predict_proba(X_scaled)[:, 1][0]
        prob_lgbm = self.lgbm_model.predict(X_scaled)[0]
        
        ensemble_score = (0.55 * prob_xgb) + (0.45 * prob_lgbm)

        # 5. Apply Zone Offset & Decisioning (Section 12)
        adjusted_score = np.clip(ensemble_score + offset, 0.0, 1.0)
        
        # Threshold selection based on Priority
        p_thresholds = self.thresholds.get(priority, self.thresholds[2])
        
        if adjusted_score < p_thresholds["AUTO_APPROVE"]:
            decision = "AUTO_APPROVE"
        elif adjusted_score < p_thresholds["APPROVE_AUDIT"]:
            decision = "APPROVE_AUDIT"
        elif adjusted_score < p_thresholds["HOLD_24HR"]:
            decision = "HOLD_24HR"
        else:
            decision = "REJECT_FREEZE"

        return {
            "model_score": float(ensemble_score),
            "zone_score_offset": float(offset),
            "adjusted_score": float(adjusted_score),
            "zone_priority": int(priority),
            "decision": decision,
            "threshold_used": float(p_thresholds["AUTO_APPROVE"] if decision == "AUTO_APPROVE" else p_thresholds["APPROVE_AUDIT"]),
            "hard_fail": False,
            "hard_fail_reason": "NONE",
            "confidence": 0.88 # Placeholder
        }
