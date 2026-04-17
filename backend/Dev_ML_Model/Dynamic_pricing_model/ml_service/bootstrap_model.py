"""
Bootstrap script — creates a dummy TorchScript model for Dynamic Pricing API.
Run once to generate the .pt file before starting the server.
"""
import torch
import torch.nn as nn
import os
import sys

# Add parent to path so we can import model
sys.path.insert(0, os.path.dirname(__file__))
from model import RideSurakshaNet

# Create model directory
model_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml_pipeline", "models"))
os.makedirs(model_dir, exist_ok=True)

# Initialize model with random weights
model = RideSurakshaNet(input_dim=38)
model.eval()

# Export as TorchScript
dummy_input = torch.randn(1, 38)
scripted = torch.jit.trace(model, dummy_input)

save_path = os.path.join(model_dir, "RideSuraksha_scripted.pt")
scripted.save(save_path)
print(f"Bootstrapped scripted model to {save_path}")

# Also save state dict as fallback
state_path = os.path.join(model_dir, "RideSuraksha_net.pt")
torch.save(model.state_dict(), state_path)
print(f"Saved state dict to {state_path}")
