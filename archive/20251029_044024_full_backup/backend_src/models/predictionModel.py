import torch
import torch.nn as nn
from typing import List

class MatchPredictor(nn.Module):
    def __init__(self, input_size: int, hidden_size: int = 32, output_size: int = 3):
        super(MatchPredictor, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)  # logits, softmax applied later
        return x

# Load model function
def load_model(input_size: int, path="data/prediction_model.pth", device=None):
    device = device or ("cuda" if torch.cuda.is_available() else "cpu")
    model = MatchPredictor(input_size).to(device)
    model.load_state_dict(torch.load(path, map_location=device))
    model.eval()
    return model