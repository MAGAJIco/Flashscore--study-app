
export interface EducationalMetric {
  userId: string;
  category: string;
  value: number;
  timestamp: Date;
}

export class EducationalAnalytics {
  static trackLearningProgress(userId: string, topic: string, score: number): void {
    // Placeholder for tracking learning progress
    console.log(`User ${userId} scored ${score} on ${topic}`);
  }

  static calculateComprehension(correctAnswers: number, totalQuestions: number): number {
    if (totalQuestions === 0) return 0;
    return (correctAnswers / totalQuestions) * 100;
  }

  static recommendNextTopic(userHistory: EducationalMetric[]): string {
    // Simple recommendation based on lowest scoring category
    if (userHistory.length === 0) return 'basics';
    
    const categoryScores = new Map<string, number[]>();
    userHistory.forEach(metric => {
      if (!categoryScores.has(metric.category)) {
        categoryScores.set(metric.category, []);
      }
      categoryScores.get(metric.category)!.push(metric.value);
    });

    let lowestCategory = 'basics';
    let lowestAvg = 100;

    categoryScores.forEach((scores, category) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg < lowestAvg) {
        lowestAvg = avg;
        lowestCategory = category;
      }
    });

    return lowestCategory;
  }
}
