'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generatePredictions } from '@actions/predictions'

export default function GeneratePredictionsButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    setLoading(true)
    try {
      await generatePredictions()
      router.refresh() // Refresh the page to show new predictions
    } catch (error) {
      console.error('Failed to generate predictions:', error)
      alert('Failed to generate predictions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Generating...
        </span>
      ) : (
        'Generate Predictions'
      )}
    </button>
  )
}