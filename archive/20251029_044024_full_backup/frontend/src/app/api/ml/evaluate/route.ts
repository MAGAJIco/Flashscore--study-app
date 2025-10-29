
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testData, testLabels } = body;

    if (!testData || !testLabels) {
      return NextResponse.json(
        { error: 'Test data and labels required' },
        { status: 400 }
      );
    }

    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://0.0.0.0:8000';
    
    const predictions = [];
    let correct = 0;

    for (let i = 0; i < testData.length; i++) {
      const response = await fetch(`${mlServiceUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: testData[i] }),
      });

      const result = await response.json();
      const predicted = ['home', 'draw', 'away'].indexOf(result.result?.prediction || result.prediction);
      
      if (predicted === testLabels[i]) {
        correct++;
      }

      predictions.push({
        features: testData[i],
        predicted,
        actual: testLabels[i],
        correct: predicted === testLabels[i],
      });
    }

    const accuracy = correct / testData.length;

    return NextResponse.json({
      success: true,
      evaluation: {
        accuracy,
        correct,
        total: testData.length,
        predictions,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Evaluation failed:', error);
    return NextResponse.json(
      { error: 'Evaluation failed', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
