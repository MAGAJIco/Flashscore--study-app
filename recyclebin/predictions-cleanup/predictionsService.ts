
import axios from 'axios';
import { JSDOM } from 'jsdom';
import CacheManager from '@shared/utils/cacheManager';

interface Prediction {
  title: string;
  content?: string;
  sport?: string;
  confidence?: string;
  source?: string;
}

export async function fetchPredictions(): Promise<Prediction[]> {
  const cacheKey = 'predictions_data';
  
  // Try cache first
  const cached = CacheManager.get(cacheKey);
  if (cached) {
    console.log('Returning cached predictions');
    return cached;
  }

  try {
    const response = await axios.get('https://www.mybets.today/recommended-soccer-predictions/tomorrow/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Extract predictions with enhanced data
    const predictionElements = document.querySelectorAll('h2.prediction-title, .match-prediction, .bet-tip');
    const predictions: Prediction[] = [];
    
    predictionElements.forEach((element, index) => {
      const title = element.textContent?.trim();
      if (title && title.length > 10) {
        // Analyze confidence based on keywords
        const confidence = analyzeConfidence(title);
        const sport = extractSport(title);
        
        predictions.push({ 
          title,
          content: `Analysis: ${title.substring(0, 100)}...`,
          sport: sport,
          confidence: confidence,
          source: 'external'
        });
      }
    });

    // Add some internal predictions
    const internalPredictions = generateInternalPredictions();
    predictions.push(...internalPredictions);

    // Cache for 10 minutes
    CacheManager.set(cacheKey, predictions, 10);
    
    return predictions;
  } catch (error) {
    console.error('Failed to fetch predictions:', error);
    
    // Log detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Detailed error:', { message: errorMessage, stack: error instanceof Error ? error.stack : 'No stack' });
    
    // Return fallback data if available in cache or generate mock data
    const fallback = CacheManager.get('fallback_predictions') || generateFallbackPredictions();
    CacheManager.set('fallback_predictions', fallback, 60); // Cache fallback for 1 hour
    
    // Throw a more descriptive error for UI handling
    if (!fallback.length) {
      throw new Error(`Unable to fetch predictions: ${errorMessage}. Please check your internet connection and try again.`);
    }
    
    return fallback;
  }
}

function analyzeConfidence(title: string): string {
  const highConfidenceWords = ['sure', 'guaranteed', 'certain', 'definite'];
  const mediumConfidenceWords = ['likely', 'probable', 'expected'];
  
  const lowerTitle = title.toLowerCase();
  
  if (highConfidenceWords.some(word => lowerTitle.includes(word))) {
    return '85-95%';
  } else if (mediumConfidenceWords.some(word => lowerTitle.includes(word))) {
    return '65-80%';
  }
  
  return '50-70%';
}

function extractSport(title: string): string {
  const sportsKeywords = {
    'soccer': ['soccer', 'football', 'fc ', 'united', 'city'],
    'basketball': ['nba', 'basketball', 'lakers', 'warriors'],
    'tennis': ['tennis', 'atp', 'wta', 'open'],
    'baseball': ['mlb', 'baseball', 'yankees', 'dodgers']
  };
  
  const lowerTitle = title.toLowerCase();
  
  for (const [sport, keywords] of Object.entries(sportsKeywords)) {
    if (keywords.some(keyword => lowerTitle.includes(keyword))) {
      return sport;
    }
  }
  
  return 'soccer'; // default
}

function generateInternalPredictions(): Prediction[] {
  return [
    {
      title: 'Manchester United vs Chelsea - Draw Analysis',
      content: 'Both teams showing similar form, defensive strengths suggest low-scoring draw',
      sport: 'soccer',
      confidence: '75%',
      source: 'internal'
    },
    {
      title: 'Real Madrid vs Barcelona - Over 2.5 Goals',
      content: 'El Clasico traditionally high-scoring, both teams have strong attacking records',
      sport: 'soccer',
      confidence: '80%',
      source: 'internal'
    }
  ];
}

function generateFallbackPredictions(): Prediction[] {
  return [
    {
      title: 'Liverpool vs Arsenal - Liverpool Win',
      content: 'Home advantage and recent form favor Liverpool',
      sport: 'soccer',
      confidence: '70%',
      source: 'fallback'
    },
    {
      title: 'Bayern Munich vs Dortmund - Over 3.5 Goals',
      content: 'German derbies typically feature many goals',
      sport: 'soccer',
      confidence: '65%',
      source: 'fallback'
    }
  ];
}

// Prefetch function for background loading
export async function prefetchPredictions(): Promise<void> {
  try {
    await fetchPredictions();
    console.log('Predictions prefetched successfully');
  } catch (error) {
    console.warn('Prefetch failed:', error);
  }
}
