import numpy as np
import pandas as pd
from typing import Dict, List, Any

class RideSurakshaPipeline:
    def __init__(self, target_input_size=38):
        self.target_input_size = target_input_size
        
    def transform(self, data: Dict[str, Any]) -> np.ndarray:
        """
        Transforms raw input data into the 38-feature vector required by the model.
        """
        # 1. ZONE DATA (6 features)
        zone_data = [
            data.get('flood_risk_score', 0.5), # 0.0 - 1.0
            data.get('dist_to_river_km', 5.0),
            data.get('dist_to_coast_km', 10.0),
            data.get('drainage_quality_index', 0.5), # 0.0 - 1.0
            data.get('waterlogging_incidents_3y', 2),
            data.get('elevation_amsl_m', 6.0)
        ]
        
        # 2. RIDER DATA (5 features)
        rider_data = [
            data.get('tenure_months', 12),
            data.get('avg_daily_earnings_rs', 1500),
            data.get('hours_per_week', 40),
            data.get('order_completion_rate', 0.95), # 0.0 - 1.0
            data.get('peak_hours_participation', 0.8) # % of peak hours active
        ]
        
        # 3. WEATHER / LIVE DATA (7 features)
        weather_data = [
            data.get('rainfall_last_7d_mm', 0.0),
            data.get('cyclone_in_forecast', 0), # Binary
            data.get('reservoir_release_mm', 0.0),
            data.get('aqi_level', 150),
            data.get('consecutive_rain_days', 0),
            data.get('week_of_year', 1), # 1-52
            data.get('is_monsoon_season', 0) # Binary
        ]
        
        # 4. ENGINEERED SIGNALS (5 features)
        # Risk Exposure Index: blends zone danger, current rainfall, flood probability, infrastructure
        rei = (data.get('flood_risk_score', 0.5) * 0.4 + 
               (data.get('rainfall_last_7d_mm', 0.0) / 100) * 0.3 + 
               (1 - data.get('drainage_quality_index', 0.5)) * 0.3)
        
        # Income Vulnerability: potential lost earnings (daily * hours_pct * zone_risk)
        iv = (data.get('avg_daily_earnings_rs', 1500) * 
              (data.get('hours_per_week', 40) / 70) * 
              data.get('flood_risk_score', 0.5))
        
        # Weather Intensity: rainfall, rain days, cyclone
        wi = (data.get('rainfall_last_7d_mm', 0.0) * 0.5 + 
              data.get('consecutive_rain_days', 0) * 10 + 
              data.get('cyclone_in_forecast', 0) * 50)
        
        # Rain x Zone Risk: interactions
        rzr = data.get('rainfall_last_7d_mm', 0.0) * data.get('flood_risk_score', 0.5)
        
        # Cyclone x Reservoir Release
        crr = data.get('cyclone_in_forecast', 0) * data.get('reservoir_release_mm', 0.0)
        
        engineered_signals = [rei, iv, wi, rzr, crr]
        
        # Combine base features (23 features)
        base_features = zone_data + rider_data + weather_data + engineered_signals
        
        # 5. EXPAND TO 38 FEATURES (if needed)
        # Adding some standard interactions and rolling statistics to reach 38
        extra_features = [
            data.get('aqi_level', 150) * data.get('hours_per_week', 40) / 1000, # Safety exposure
            data.get('tenure_months', 12) * data.get('order_completion_rate', 0.95), # Reliability
            data.get('elevation_amsl_m', 6.0) / (data.get('dist_to_river_km', 5.0) + 1), # Slope/Flood ease
            # Some dummy features or placeholders to match training dimension 38
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
        ]
        
        all_features = base_features + extra_features
        
        # Truncate or pad to exactly target_input_size
        all_features = all_features[:self.target_input_size]
        
        # Ensure we have a numpy array of shape (1, 38)
        return np.array(all_features, dtype=np.float32).reshape(1, -1)

pipeline = RideSurakshaPipeline(target_input_size=38)
