
"use client";
import React, { useState } from 'react';

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

export default function PredictionsManager() {
  const [predictions, setPredictions] = useState<Prediction[]>([
    {
      id: '1',
      matchup: 'Manchester United vs Arsenal',
      sport: 'Football',
      prediction: 'Arsenal Win',
      confidence: 87.5,
      odds: '2.1',
      status: 'correct',
      matchDate: '2024-01-15',
      createdBy: 'AI Engine',
      aiScore: 94.2
    },
    {
      id: '2',
      matchup: 'Lakers vs Warriors',
      sport: 'Basketball',
      prediction: 'Lakers Win',
      confidence: 73.2,
      odds: '1.8',
      status: 'pending',
      matchDate: '2024-01-16',
      createdBy: 'AI Engine',
      aiScore: 89.1
    },
    {
      id: '3',
      matchup: 'Chiefs vs Bills',
      sport: 'American Football',
      prediction: 'Over 45.5 Points',
      confidence: 91.3,
      odds: '1.9',
      status: 'incorrect',
      matchDate: '2024-01-14',
      createdBy: 'Expert Analyst',
      aiScore: 76.8
    }
  ]);

  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredPredictions = predictions.filter(prediction => {
    const sportMatch = selectedSport === 'all' || prediction.sport === selectedSport;
    const statusMatch = selectedStatus === 'all' || prediction.status === selectedStatus;
    return sportMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct': return 'bg-green-100 text-green-800';
      case 'incorrect': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const accuracyRate = predictions.filter(p => p.status !== 'pending' && p.status !== 'cancelled').length > 0
    ? (predictions.filter(p => p.status === 'correct').length / 
       predictions.filter(p => p.status !== 'pending' && p.status !== 'cancelled').length) * 100
    : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Predictions Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Create Prediction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Predictions</h3>
          <p className="text-2xl font-bold text-blue-600">{predictions.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Accuracy Rate</h3>
          <p className="text-2xl font-bold text-green-600">{accuracyRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {predictions.filter(p => p.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Avg Confidence</h3>
          <p className="text-2xl font-bold text-purple-600">
            {(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <select 
          value={selectedSport} 
          onChange={(e) => setSelectedSport(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Sports</option>
          <option value="Football">Football</option>
          <option value="Basketball">Basketball</option>
          <option value="American Football">American Football</option>
          <option value="Tennis">Tennis</option>
        </select>

        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="correct">Correct</option>
          <option value="incorrect">Incorrect</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matchup</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPredictions.map((prediction) => (
              <tr key={prediction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{prediction.matchup}</div>
                    <div className="text-sm text-gray-500">{prediction.matchDate}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prediction.sport}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prediction.prediction}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
                    {prediction.confidence}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prediction.odds}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prediction.status)}`}>
                    {prediction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prediction.aiScore}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
