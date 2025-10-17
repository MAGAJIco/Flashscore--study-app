
import time
from collections import defaultdict
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

class MLServiceMonitor:
    def __init__(self):
        self.request_count = 0
        self.error_count = 0
        self.total_latency = 0
        self.latency_samples = []
        self.prediction_distribution = defaultdict(int)
        self.start_time = time.time()
    
    def record_request(self, latency: float, prediction: str, success: bool = True):
        self.request_count += 1
        self.total_latency += latency
        self.latency_samples.append(latency)
        
        if len(self.latency_samples) > 1000:
            self.latency_samples = self.latency_samples[-1000:]
        
        if success:
            self.prediction_distribution[prediction] += 1
        else:
            self.error_count += 1
    
    def get_stats(self) -> Dict:
        uptime = time.time() - self.start_time
        avg_latency = self.total_latency / self.request_count if self.request_count > 0 else 0
        
        p95_latency = 0
        if self.latency_samples:
            sorted_samples = sorted(self.latency_samples)
            p95_index = int(len(sorted_samples) * 0.95)
            p95_latency = sorted_samples[p95_index] if p95_index < len(sorted_samples) else 0
        
        return {
            "uptime_seconds": uptime,
            "total_requests": self.request_count,
            "error_count": self.error_count,
            "error_rate": self.error_count / self.request_count if self.request_count > 0 else 0,
            "avg_latency_ms": avg_latency * 1000,
            "p95_latency_ms": p95_latency * 1000,
            "requests_per_second": self.request_count / uptime if uptime > 0 else 0,
            "prediction_distribution": dict(self.prediction_distribution)
        }

monitor = MLServiceMonitor()
