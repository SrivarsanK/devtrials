import torch
import os
import sys

# Add current dir to path
sys.path.append(os.getcwd())

import model as shield_model

model_path = r"..\ml_pipeline\models\RideSuraksha_scripted.pt"
net_path = r"..\ml_pipeline\models\RideSuraksha_net.pt"

print(f"Checking {model_path}...")
if os.path.exists(model_path):
    try:
        model = torch.jit.load(model_path, map_location='cpu')
        print("SUCCESS: Scripted model loaded (mapped to CPU)!")
    except Exception as e:
        print(f"FAIL: Scripted model error: {e}")
else:
    print("FAIL: Scripted model file missing")

print(f"\nChecking {net_path}...")
if os.path.exists(net_path):
    try:
        # Need the actual class for state_dict
        model = shield_model.RideSurakshaNet(input_dim=38)
        model.load_state_dict(torch.load(net_path, map_location=torch.device('cpu')))
        print("SUCCESS: State dict loaded!")
    except Exception as e:
        print(f"FAIL: State dict error: {e}")
else:
    print("FAIL: State dict file missing")
