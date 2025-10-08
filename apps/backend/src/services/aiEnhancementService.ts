import { MLPredictionResponse } from './mlPredictionService';

interface OpenAIConfig {
  apiKey: string;
  model: string;
}

class AIEnhancementService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(config?: OpenAIConfig) {
    this.apiKey = config?.apiKey || process.env.OPENAI_API_KEY || '';
  }

  async enhancePredictionWithInsights(
    prediction: MLPredictionResponse,
    matchContext: {
      homeTeam: string;
      awayTeam: string;
      league?: string;
    }
  ): Promise<{
    prediction: MLPredictionResponse;
    aiInsights: string;
    strategicAdvice: string;
  }> {
    if (!this.apiKey) {
      return {
        prediction,
        aiInsights: 'AI enhancement unavailable - API key not configured',
        strategicAdvice: 'Configure OpenAI API key in Secrets to enable AI insights'
      };
    }

    try {
      const prompt = `Analyze this sports prediction:
Match: ${matchContext.homeTeam} vs ${matchContext.awayTeam}
Prediction: ${prediction.prediction}
Confidence: ${prediction.confidence}%
Probabilities: Home ${prediction.probabilities.home.toFixed(2)}, Draw ${prediction.probabilities.draw.toFixed(2)}, Away ${prediction.probabilities.away.toFixed(2)}

Provide:
1. Brief tactical insight (2-3 sentences)
2. Key factors to watch
3. Strategic betting advice`;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a sports analytics expert providing concise, actionable insights.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const insights = data.choices[0]?.message?.content || 'No insights generated';

      return {
        prediction,
        aiInsights: insights,
        strategicAdvice: this.extractStrategicAdvice(insights)
      };
    } catch (error) {
      console.error('AI Enhancement error:', error);
      return {
        prediction,
        aiInsights: 'AI analysis temporarily unavailable',
        strategicAdvice: 'Rely on ML prediction confidence scores'
      };
    }
  }

  async generateMatchNarrative(
    homeTeam: string,
    awayTeam: string,
    stats: any
  ): Promise<string> {
    if (!this.apiKey) {
      return `${homeTeam} vs ${awayTeam} - AI narrative unavailable`;
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Create engaging 2-sentence match previews for sports fans.'
            },
            {
              role: 'user',
              content: `Match: ${homeTeam} vs ${awayTeam}. Stats: ${JSON.stringify(stats)}`
            }
          ],
          max_tokens: 100
        })
      });

      const data = await response.json() as any;
      return data.choices[0]?.message?.content || `${homeTeam} faces ${awayTeam} in an exciting matchup.`;
    } catch (error) {
      return `${homeTeam} vs ${awayTeam} - Watch this space for analysis.`;
    }
  }

  private extractStrategicAdvice(insights: string): string {
    const lines = insights.split('\n');
    const adviceLine = lines.find(line => 
      line.toLowerCase().includes('advice') || 
      line.toLowerCase().includes('recommend')
    );
    return adviceLine || 'Follow ML prediction confidence levels';
  }

  async enhanceCEODecision(
    predictions: any[],
    marketConditions: string
  ): Promise<string> {
    if (!this.apiKey || predictions.length === 0) {
      return 'Standard MagajiCo analysis applied';
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a strategic advisor analyzing sports betting opportunities like Warren Buffett analyzes stocks.'
            },
            {
              role: 'user',
              content: `Market: ${marketConditions}\nTop Predictions: ${JSON.stringify(predictions.slice(0, 3))}\nProvide strategic recommendation.`
            }
          ],
          max_tokens: 150
        })
      });

      const data = await response.json() as any;
      return data.choices[0]?.message?.content || 'Market analysis in progress';
    } catch (error) {
      return 'CEO strategic mode: Active';
    }
  }
}

export default new AIEnhancementService();