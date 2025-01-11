import { wsService } from '../services/websocket';

export class AlgorithmController {
  // Algorithme 1: Analyse de sentiment des conversations
  static async analyzeSentiment(text: string) {
    const response = await fetch('/api/analyze-sentiment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    return response.json();
  }

  // Algorithme 2: Prédiction du temps d'attente
  static predictWaitTime(queueLength: number, agentsAvailable: number) {
    const averageCallDuration = 5; // minutes
    return (queueLength / agentsAvailable) * averageCallDuration;
  }

  // Algorithme 3: Optimisation des horaires des agents
  static optimizeSchedule(agents: any[], shifts: any[]) {
    // Algorithme d'optimisation des horaires
    return shifts.map(shift => ({
      ...shift,
      assignedAgent: agents.find(agent => agent.available)
    }));
  }

  // Algorithme 4: Recommandation d'articles similaires
  static recommendArticles(articleId: number, userPreferences: any[]) {
    return userPreferences
      .filter(pref => pref.category === 'news')
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  // Algorithme 5: Analyse des performances des agents
  static analyzeAgentPerformance(agentId: string, metrics: any[]) {
    const performance = metrics.reduce((acc, metric) => ({
      callsHandled: acc.callsHandled + metric.calls,
      avgDuration: acc.avgDuration + metric.duration,
      satisfaction: acc.satisfaction + metric.rating
    }), { callsHandled: 0, avgDuration: 0, satisfaction: 0 });

    return {
      ...performance,
      avgDuration: performance.avgDuration / metrics.length,
      satisfaction: performance.satisfaction / metrics.length
    };
  }

  // Algorithme 6: Routage intelligent des appels
  static routeCall(call: any, agents: any[]) {
    return agents
      .filter(agent => agent.available && agent.skills.includes(call.type))
      .sort((a, b) => b.performance - a.performance)[0];
  }

  // Algorithme 7: Prédiction des pics d'appels
  static predictCallVolume(historicalData: any[]) {
    const movingAverage = historicalData
      .slice(-7)
      .reduce((acc, curr) => acc + curr.volume, 0) / 7;
    
    return {
      predictedVolume: movingAverage,
      confidence: 0.85
    };
  }
}