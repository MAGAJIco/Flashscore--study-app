
"use client";

import { useState } from 'react';

interface Prediction {
  id: string;
  matchup: string;
  sport: string;
  prediction: string;
  confidence: number;
  odds: string;
  status: 'pending' | 'correct' | 'incorrect' | 'cancelled';
  matchDate: string;
  createdBy: string;
  aiScore: number;
}

export default function PredictionsManagementPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Predictions Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Create Prediction
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Predictions management interface</p>
        <p className="text-sm text-gray-500 mt-2">
          Use the API at /api/predictions to manage predictions
        </p>
      </div>
    </div>
  );
}
