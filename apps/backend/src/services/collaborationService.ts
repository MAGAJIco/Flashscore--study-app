import { NewsAuthorService } from './newsAuthorService';
import { INews } from '../models/News';

export class CollaborationService {
  // Simulate prediction collaboration that triggers auto-news
  static async handlePredictionResult(predictionData: {
    authorId: string;
    matchName: string;
    prediction: string;
    actualResult: string;
    confidence: number;
  }): Promise<INews | null> {
    const { authorId, matchName, prediction, actualResult, confidence } = predictionData;
    
    // Check if prediction was successful
    const isSuccessful = prediction.toLowerCase() === actualResult.toLowerCase();
    
    if (isSuccessful) {
      // Generate success news
      return await NewsAuthorService.generateAutoNews(authorId, 'prediction_success', {
        matchName,
        prediction,
        confidence
      });
    } else {
      // Could generate learning/analysis news for failed predictions
      return await NewsAuthorService.generateAutoNews(authorId, 'analysis_update', {
        topic: `Analysis of ${matchName} - Learning from Predictions`
      });
    }
  }

  // Handle community interaction milestones
  static async handleMilestone(authorId: string, milestone: number): Promise<INews | null> {
    if (milestone % 5 === 0 && milestone >= 5) {
      return await NewsAuthorService.generateAutoNews(authorId, 'community_milestone', {
        milestone
      });
    }
    return null;
  }

  // Handle analysis sharing
  static async handleAnalysisShared(authorId: string, analysisData: {
    topic: string;
    category: string;
  }): Promise<INews | null> {
    return await NewsAuthorService.generateAutoNews(authorId, 'analysis_update', {
      topic: analysisData.topic
    });
  }

  // Simulate Mara collaboration (demo function)
  static async simulateMaraCollaboration(): Promise<INews | null> {
    const predictionData = {
      authorId: 'mara',
      matchName: 'Liverpool vs Arsenal',
      prediction: 'Liverpool Win',
      actualResult: 'Liverpool Win',
      confidence: 85
    };

    return await this.handlePredictionResult(predictionData);
  }

  // Initialize default collaborations for demo
  static async initializeDemoCollaborations(): Promise<INews[]> {
    const results: INews[] = [];

    // Mara's successful prediction
    const maraNews = await this.simulateMaraCollaboration();
    if (maraNews) results.push(maraNews);

    // Alex's milestone
    const alexMilestone = await this.handleMilestone('alex_sports', 10);
    if (alexMilestone) results.push(alexMilestone);

    // Sarah's analysis
    const sarahAnalysis = await this.handleAnalysisShared('sarah_stats', {
      topic: 'Premier League Performance Metrics',
      category: 'statistics'
    });
    if (sarahAnalysis) results.push(sarahAnalysis);

    return results;
  }
}