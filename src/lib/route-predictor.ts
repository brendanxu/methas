/**
 * Route Predictor
 * 
 * Predicts user navigation patterns for intelligent preloading
 */

import { PreloadConfig, RoutePreloadRule, PreloadCondition } from './preload-config';
import { UserBehavior } from './behavior-tracker';

export interface RoutePrediction {
  route: string;
  probability: number;
  confidence: number;
  reasons: string[];
}

export interface NavigationPattern {
  fromRoute: string;
  toRoute: string;
  count: number;
  lastVisited: number;
  averageTime: number;
}

export class RoutePredictor {
  private config: PreloadConfig;
  private navigationHistory: NavigationPattern[] = [];
  private routeTransitions: Map<string, Map<string, number>> = new Map();

  constructor(config: PreloadConfig) {
    this.config = config;
    this.loadNavigationHistory();
  }

  private loadNavigationHistory(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('southpole_navigation_history');
      if (stored) {
        this.navigationHistory = JSON.parse(stored);
        this.buildTransitionMatrix();
      }
    } catch (error) {
      console.warn('Failed to load navigation history:', error);
    }
  }

  private saveNavigationHistory(): void {
    if (typeof window === 'undefined') return;

    try {
      // Keep only last 100 patterns to prevent storage bloat
      const trimmedHistory = this.navigationHistory.slice(-100);
      localStorage.setItem('southpole_navigation_history', JSON.stringify(trimmedHistory));
    } catch (error) {
      console.warn('Failed to save navigation history:', error);
    }
  }

  private buildTransitionMatrix(): void {
    this.routeTransitions.clear();
    
    this.navigationHistory.forEach(pattern => {
      if (!this.routeTransitions.has(pattern.fromRoute)) {
        this.routeTransitions.set(pattern.fromRoute, new Map());
      }
      
      const fromMap = this.routeTransitions.get(pattern.fromRoute)!;
      fromMap.set(pattern.toRoute, pattern.count);
    });
  }

  private evaluateCondition(
    condition: PreloadCondition,
    behavior: UserBehavior
  ): boolean {
    const { type, operator, value } = condition;
    
    let actualValue: number | string;
    
    switch (type) {
      case 'scroll':
        actualValue = behavior.scrollDepth;
        break;
      case 'time':
        actualValue = behavior.dwellTime;
        break;
      case 'interaction':
        actualValue = behavior.interactionCount;
        break;
      case 'device':
        actualValue = behavior.deviceInfo.memory || 0;
        break;
      case 'connection':
        actualValue = behavior.networkInfo.downlink || 0;
        break;
      default:
        return false;
    }
    
    switch (operator) {
      case 'gt':
        return actualValue > value;
      case 'lt':
        return actualValue < value;
      case 'eq':
        return actualValue === value;
      case 'includes':
        return String(actualValue).includes(String(value));
      default:
        return false;
    }
  }

  private calculateRuleProbability(
    rule: RoutePreloadRule,
    behavior: UserBehavior
  ): number {
    // Check if all conditions are met
    const conditionsMet = rule.conditions.every(condition =>
      this.evaluateCondition(condition, behavior)
    );
    
    if (!conditionsMet) {
      return 0;
    }
    
    // Base probability from rule
    let probability = rule.probability;
    
    // Adjust based on historical data
    const fromMap = this.routeTransitions.get(rule.fromRoute);
    if (fromMap) {
      const transitionCount = fromMap.get(rule.toRoute) || 0;
      const totalTransitions = Array.from(fromMap.values()).reduce((sum, count) => sum + count, 0);
      
      if (totalTransitions > 0) {
        const historicalProbability = transitionCount / totalTransitions;
        // Weighted average: 70% historical, 30% rule-based
        probability = (historicalProbability * 0.7) + (probability * 0.3);
      }
    }
    
    // Adjust based on user engagement
    const engagementScore = this.calculateEngagementScore(behavior);
    if (engagementScore > 70) {
      probability *= 1.2; // Increase for highly engaged users
    } else if (engagementScore < 30) {
      probability *= 0.8; // Decrease for low engagement
    }
    
    return Math.min(probability, 1);
  }

  private calculateEngagementScore(behavior: UserBehavior): number {
    let score = 0;
    score += Math.min(behavior.scrollDepth * 0.3, 30);
    score += Math.min((behavior.dwellTime / 1000) * 2.5, 25);
    score += Math.min(behavior.interactionCount * 5, 25);
    
    const sessionDuration = Date.now() - behavior.sessionStartTime;
    score += Math.min((sessionDuration / 60000) * 2, 20);
    
    return Math.round(score);
  }

  private calculateConfidence(
    rule: RoutePreloadRule,
    behavior: UserBehavior,
    probability: number
  ): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on condition specificity
    confidence += rule.conditions.length * 0.1;
    
    // Increase confidence based on historical data
    const fromMap = this.routeTransitions.get(rule.fromRoute);
    if (fromMap) {
      const totalTransitions = Array.from(fromMap.values()).reduce((sum, count) => sum + count, 0);
      if (totalTransitions > 5) {
        confidence += 0.2; // More confident with more data
      }
    }
    
    // Increase confidence for device-appropriate predictions
    if (behavior.deviceInfo.isLowEnd && probability < 0.7) {
      confidence += 0.1; // More conservative on low-end devices
    }
    
    // Respect data saver mode
    if (behavior.networkInfo.saveData && probability < 0.8) {
      confidence += 0.1; // More conservative with data saver
    }
    
    return Math.min(confidence, 1);
  }

  // Public API
  public predictRoutes(behavior: UserBehavior): RoutePrediction[] {
    const predictions: RoutePrediction[] = [];
    
    // Get predictions from configured rules
    const applicableRules = this.config.routes.filter(rule =>
      rule.fromRoute === behavior.currentRoute
    );
    
    applicableRules.forEach(rule => {
      const probability = this.calculateRuleProbability(rule, behavior);
      
      if (probability > 0.1) { // Only include meaningful predictions
        const confidence = this.calculateConfidence(rule, behavior, probability);
        const reasons = this.generateReasons(rule, behavior);
        
        predictions.push({
          route: rule.toRoute,
          probability,
          confidence,
          reasons
        });
      }
    });
    
    // Add historical predictions for routes not covered by rules
    const ruleRoutes = new Set(applicableRules.map(rule => rule.toRoute));
    const fromMap = this.routeTransitions.get(behavior.currentRoute);
    
    if (fromMap) {
      fromMap.forEach((count, toRoute) => {
        if (!ruleRoutes.has(toRoute) && count > 2) {
          const totalTransitions = Array.from(fromMap.values()).reduce((sum, c) => sum + c, 0);
          const probability = count / totalTransitions;
          
          if (probability > 0.15) {
            predictions.push({
              route: toRoute,
              probability,
              confidence: Math.min(count / 10, 0.8), // Confidence based on frequency
              reasons: [`Historical pattern (${count}/${totalTransitions} visits)`]
            });
          }
        }
      });
    }
    
    // Sort by probability * confidence
    return predictions
      .sort((a, b) => (b.probability * b.confidence) - (a.probability * a.confidence))
      .slice(0, 5); // Top 5 predictions
  }

  private generateReasons(rule: RoutePreloadRule, behavior: UserBehavior): string[] {
    const reasons: string[] = [];
    
    rule.conditions.forEach(condition => {
      switch (condition.type) {
        case 'scroll':
          if (behavior.scrollDepth >= condition.value) {
            reasons.push(`User has scrolled ${behavior.scrollDepth}% (threshold: ${condition.value}%)`);
          }
          break;
        case 'time':
          if (behavior.dwellTime >= condition.value) {
            reasons.push(`User spent ${Math.round(behavior.dwellTime / 1000)}s on page (threshold: ${condition.value / 1000}s)`);
          }
          break;
        case 'interaction':
          if (behavior.interactionCount >= condition.value) {
            reasons.push(`User made ${behavior.interactionCount} interactions (threshold: ${condition.value})`);
          }
          break;
      }
    });
    
    // Add historical reason if available
    const fromMap = this.routeTransitions.get(rule.fromRoute);
    if (fromMap) {
      const count = fromMap.get(rule.toRoute) || 0;
      if (count > 0) {
        reasons.push(`Historical navigation pattern (${count} previous visits)`);
      }
    }
    
    return reasons;
  }

  public recordNavigation(fromRoute: string, toRoute: string, timeSpent: number): void {
    const existingPattern = this.navigationHistory.find(
      pattern => pattern.fromRoute === fromRoute && pattern.toRoute === toRoute
    );
    
    if (existingPattern) {
      existingPattern.count++;
      existingPattern.lastVisited = Date.now();
      existingPattern.averageTime = (existingPattern.averageTime + timeSpent) / 2;
    } else {
      this.navigationHistory.push({
        fromRoute,
        toRoute,
        count: 1,
        lastVisited: Date.now(),
        averageTime: timeSpent
      });
    }
    
    this.buildTransitionMatrix();
    this.saveNavigationHistory();
  }

  public getTopRoutes(fromRoute: string, limit: number = 3): string[] {
    const fromMap = this.routeTransitions.get(fromRoute);
    if (!fromMap) return [];
    
    return Array.from(fromMap.entries())
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, limit)
      .map(([route]) => route);
  }

  public clearHistory(): void {
    this.navigationHistory = [];
    this.routeTransitions.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('southpole_navigation_history');
    }
  }

  public getNavigationStats(): {
    totalPatterns: number;
    totalTransitions: number;
    mostVisitedRoute: string | null;
    averageSessionTime: number;
  } {
    const totalPatterns = this.navigationHistory.length;
    const totalTransitions = this.navigationHistory.reduce((sum, pattern) => sum + pattern.count, 0);
    
    // Find most visited route
    const routeCounts = new Map<string, number>();
    this.navigationHistory.forEach(pattern => {
      routeCounts.set(pattern.toRoute, (routeCounts.get(pattern.toRoute) || 0) + pattern.count);
    });
    
    const mostVisitedRoute = routeCounts.size > 0
      ? Array.from(routeCounts.entries()).sort(([, a], [, b]) => b - a)[0][0]
      : null;
    
    const averageSessionTime = this.navigationHistory.length > 0
      ? this.navigationHistory.reduce((sum, pattern) => sum + pattern.averageTime, 0) / this.navigationHistory.length
      : 0;
    
    return {
      totalPatterns,
      totalTransitions,
      mostVisitedRoute,
      averageSessionTime
    };
  }
}