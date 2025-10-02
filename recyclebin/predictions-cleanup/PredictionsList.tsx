'use client'

import { useState } from 'react'
import { deletePrediction, type Prediction } from '@actions/predictions'

interface PredictionsListProps {
  initialPredictions: Prediction[]
}

export default function PredictionsList({ initialPredictions }: PredictionsListProps) {
  const [predictions, setPredictions] = useState<Prediction[]>(initialPredictions)
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prediction?')) {
      return
    }

    setLoading(id)
    try {
      await deletePrediction(id)
      setPredictions(predictions.filter(p => p.id !== id))
    } catch (error) {
      console.error('Failed to delete prediction:', error)
      alert('Failed to delete prediction')
    } finally {
      setLoading(null)
    }
  }

  if (predictions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No predictions yet. Generate some to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {predictions.map((prediction) => (
        <div
          key={prediction.id}
          className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-gray-800 mb-2">{prediction.text}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>
                  Confidence: {(prediction.confidence * 100).toFixed(1)}%
                </span>
                <span>
                  {new Date(prediction.createdAt).toLocaleDateString()} at{' '}
                  {new Date(prediction.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(prediction.id)}
              disabled={loading === prediction.id}
              className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            >
              {loading === prediction.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}