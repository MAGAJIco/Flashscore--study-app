'use server'

import { revalidatePath } from 'next/cache'

export interface Prediction {
  id: string
  text: string
  confidence: number
  createdAt: string
}

// Mock function - replace with your actual API call
export async function generatePredictions(): Promise<Prediction[]> {
  try {
    // TODO: Replace with actual API call to your backend
    // const response = await fetch('http://your-backend-api/predictions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    // })
    // const data = await response.json()
    // return data

    // Mock data for now
    const mockPredictions: Prediction[] = [
      {
        id: '1',
        text: 'Sample prediction 1',
        confidence: 0.85,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        text: 'Sample prediction 2',
        confidence: 0.92,
        createdAt: new Date().toISOString(),
      },
    ]

    revalidatePath('/predictions')
    return mockPredictions
  } catch (error) {
    console.error('Error generating predictions:', error)
    throw new Error('Failed to generate predictions')
  }
}

export async function getPredictions(): Promise<Prediction[]> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('http://your-backend-api/predictions')
    // const data = await response.json()
    // return data

    // Mock data for now
    return []
  } catch (error) {
    console.error('Error fetching predictions:', error)
    throw new Error('Failed to fetch predictions')
  }
}

export async function deletePrediction(id: string): Promise<void> {
  try {
    // TODO: Replace with actual API call
    // await fetch(`http://your-backend-api/predictions/${id}`, {
    //   method: 'DELETE',
    // })

    revalidatePath('/predictions')
  } catch (error) {
    console.error('Error deleting prediction:', error)
    throw new Error('Failed to delete prediction')
  }
}