import torch
import torch.nn as nn
import torch.nn.functional as F

class ResidualBlock(nn.Module):
    def __init__(self, in_features, out_features, dropout_rate=0.25):
        super(ResidualBlock, self).__init__()
        self.fc = nn.Linear(in_features, out_features)
        self.bn = nn.BatchNorm1d(out_features)
        self.dropout = nn.Dropout(dropout_rate)
        
        # Shortcut if dimensions change
        self.shortcut = nn.Sequential()
        if in_features != out_features:
            self.shortcut = nn.Sequential(
                nn.Linear(in_features, out_features),
                nn.BatchNorm1d(out_features)
            )

    def forward(self, x):
        residual = self.shortcut(x)
        out = F.relu(self.bn(self.fc(x)))
        out = self.dropout(out)
        out += residual
        return F.relu(out)

class ShieldGuardNet(nn.Module):
    def __init__(self, input_dim=38):
        super(ShieldGuardNet, self).__init__()
        
        # The Shared Brain (Residual Encoder)
        self.layer1 = ResidualBlock(input_dim, 256)
        self.layer2 = ResidualBlock(256, 256)
        self.layer3 = ResidualBlock(256, 128)
        
        # Three Specialist Desks (Heads)
        # 1. Pricing Desk (final_premium_rs)
        self.pricing_head = nn.Sequential(
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 1)
        )
        
        # 2. Risk Multiplier Desk (ai_adjustment_factor)
        self.factor_head = nn.Sequential(
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 1)
        )
        
        # 3. Tier Desk (risk_tier: LOW, MEDIUM, HIGH)
        self.tier_head = nn.Sequential(
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 3) # 3 classes
        )

    def forward(self, x):
        # Shared brain
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        
        # Specialist heads
        premium = self.pricing_head(x)
        factor = self.factor_head(x)
        tier_logits = self.tier_head(x)
        
        return factor, premium, tier_logits
