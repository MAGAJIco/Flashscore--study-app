import { GrowthScore, EMPIRE_LEVELS } from './sportsIntegration';
import { Phase } from '../utils/apifoundation';

export interface AISuggestion {
  type: 'prediction' | 'phase' | 'strategy' | 'improvement';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  expectedImpact: string;
}

export const aiSuggestions = {
  generateNextMoves(
    growthScore: GrowthScore,
    currentPhases: Phase[],
    totalPower: number
  ): AISuggestion[] {
    const suggestions: AISuggestion[] = [];

    const completedPhases = currentPhases.filter(p => p.completed).length;
    const currentLevel = EMPIRE_LEVELS.find(l => l.level === growthScore.growthLevel);
    const nextLevel = EMPIRE_LEVELS.find(l => l.level === growthScore.growthLevel + 1);

    if (growthScore.winRate < 0.5 && growthScore.totalPredictions >= 5) {
      suggestions.push({
        type: 'improvement',
        title: 'Improve Your Win Rate',
        description: `Your current win rate is ${(growthScore.winRate * 100).toFixed(1)}%. Focus on analyzing match statistics and recent team performance before making predictions.`,
        priority: 'high',
        actionable: true,
        expectedImpact: `Reaching 50% win rate will unlock "${EMPIRE_LEVELS[1].name}" rank`,
      });
    }

    if (growthScore.streak >= 3) {
      suggestions.push({
        type: 'strategy',
        title: 'Hot Streak! Keep It Going',
        description: `You're on a ${growthScore.streak}-prediction winning streak! Your confidence is high - consider making predictions on upcoming high-value matches.`,
        priority: 'high',
        actionable: true,
        expectedImpact: `Each correct prediction adds ${10 * (currentLevel?.powerMultiplier || 1)} power`,
      });
    }

    if (nextLevel && growthScore.totalPredictions >= nextLevel.minPredictions - 5) {
      const predictionsNeeded = nextLevel.minPredictions - growthScore.totalPredictions;
      const winRateNeeded = nextLevel.minWinRate - growthScore.winRate;

      suggestions.push({
        type: 'prediction',
        title: `Close to ${nextLevel.name} Rank!`,
        description: `You need ${predictionsNeeded} more predictions${winRateNeeded > 0 ? ` and ${(winRateNeeded * 100).toFixed(1)}% better win rate` : ''} to reach ${nextLevel.name}.`,
        priority: 'high',
        actionable: true,
        expectedImpact: `Power multiplier will increase to ${nextLevel.powerMultiplier}x`,
      });
    }

    const unlockedPhases = currentPhases.filter(p => p.unlocked && !p.completed && !p.building);
    if (unlockedPhases.length > 0) {
      const nextPhase = unlockedPhases[0];
      suggestions.push({
        type: 'phase',
        title: `Build ${nextPhase.name}`,
        description: nextPhase.description,
        priority: 'medium',
        actionable: true,
        expectedImpact: `Gain components to boost your empire foundation`,
      });
    }

    const lockedPhases = currentPhases.filter(p => !p.unlocked);
    if (lockedPhases.length > 0) {
      const nextLocked = lockedPhases[0];
      const powerNeeded = nextLocked.requiredPower - totalPower;

      if (powerNeeded > 0 && powerNeeded <= 50) {
        suggestions.push({
          type: 'phase',
          title: `Almost Ready for ${nextLocked.name}`,
          description: `You need ${powerNeeded} more power to unlock this phase. Make ${Math.ceil(powerNeeded / 10)} correct predictions to reach it!`,
          priority: 'medium',
          actionable: true,
          expectedImpact: `Unlock new empire building opportunities`,
        });
      }
    }

    if (growthScore.totalPredictions < 5) {
      suggestions.push({
        type: 'prediction',
        title: 'Start Making Predictions',
        description: 'Make your first 5 predictions to establish your baseline growth score and unlock empire progression.',
        priority: 'high',
        actionable: true,
        expectedImpact: 'Begin your journey to becoming an Empire Legend',
      });
    }

    if (completedPhases >= 3 && growthScore.winRate >= 0.6) {
      suggestions.push({
        type: 'strategy',
        title: 'Elite Empire Builder',
        description: `You've completed ${completedPhases} phases with a ${(growthScore.winRate * 100).toFixed(1)}% win rate. Focus on high-confidence predictions to maintain your edge.`,
        priority: 'medium',
        actionable: false,
        expectedImpact: 'Maintain your status and continue growing',
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  },

  generatePredictionInsight(winRate: number, recentPredictions: number): string {
    if (recentPredictions === 0) {
      return 'No predictions yet. Start making predictions to build your empire!';
    }

    if (winRate >= 0.75) {
      return `Exceptional performance! ${(winRate * 100).toFixed(1)}% win rate puts you among the elite.`;
    } else if (winRate >= 0.6) {
      return `Strong performance! ${(winRate * 100).toFixed(1)}% win rate shows solid prediction skills.`;
    } else if (winRate >= 0.5) {
      return `Good start! ${(winRate * 100).toFixed(1)}% win rate. Keep analyzing to improve.`;
    } else {
      return `Focus on match analysis to improve your ${(winRate * 100).toFixed(1)}% win rate.`;
    }
  },
};