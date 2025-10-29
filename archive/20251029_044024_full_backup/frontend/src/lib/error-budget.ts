
interface ErrorBudget {
  totalRequests: number;
  failedRequests: number;
  budget: number; // Target: 99.9% = 0.1% error budget
  period: 'hour' | 'day' | 'week';
}

class ErrorBudgetTracker {
  private budgets: Map<string, ErrorBudget> = new Map();
  private readonly TARGET_RELIABILITY = 0.999; // 99.9%

  track(service: string, success: boolean, period: 'hour' | 'day' | 'week' = 'hour') {
    const key = `${service}_${period}`;
    let budget = this.budgets.get(key);

    if (!budget) {
      budget = {
        totalRequests: 0,
        failedRequests: 0,
        budget: 1 - this.TARGET_RELIABILITY,
        period,
      };
      this.budgets.set(key, budget);
    }

    budget.totalRequests++;
    if (!success) {
      budget.failedRequests++;
    }

    const currentErrorRate = budget.failedRequests / budget.totalRequests;
    const budgetRemaining = budget.budget - currentErrorRate;

    if (budgetRemaining < 0) {
      console.error(`🚨 ERROR BUDGET EXHAUSTED for ${service} (${period})`);
      console.error(`Current error rate: ${(currentErrorRate * 100).toFixed(2)}%`);
      console.error(`Target: ${(budget.budget * 100).toFixed(2)}%`);
    } else if (budgetRemaining < budget.budget * 0.2) {
      console.warn(`⚠️ ERROR BUDGET LOW for ${service} (${period}): ${(budgetRemaining * 100).toFixed(2)}% remaining`);
    }

    return {
      errorRate: currentErrorRate,
      budgetRemaining,
      isHealthy: budgetRemaining >= 0,
    };
  }

  getStatus(service: string, period: 'hour' | 'day' | 'week' = 'hour') {
    const budget = this.budgets.get(`${service}_${period}`);
    if (!budget) return null;

    const errorRate = budget.failedRequests / budget.totalRequests;
    return {
      totalRequests: budget.totalRequests,
      failedRequests: budget.failedRequests,
      errorRate,
      budgetRemaining: budget.budget - errorRate,
      targetReliability: this.TARGET_RELIABILITY,
    };
  }

  reset(service?: string, period?: 'hour' | 'day' | 'week') {
    if (service && period) {
      this.budgets.delete(`${service}_${period}`);
    } else {
      this.budgets.clear();
    }
  }
}

export const errorBudget = new ErrorBudgetTracker();
