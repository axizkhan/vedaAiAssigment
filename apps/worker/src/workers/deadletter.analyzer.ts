import { FailureClassification } from './deadletter.types';
import { emitOperationalAlert, emitProviderOutageAlert, emitValidationRegressionAlert } from './deadletter.alerts';

// In-memory sliding window for the DLQ worker.
// In a true distributed setup with multiple DLQ workers, this would use Redis lists or TimeSeries.
// Since DLQ concurrency is 1, in-memory is safe for local anomaly detection.
const recentFailures: { timestamp: number; classification: FailureClassification; provider: string }[] = [];

const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

export const aggregateRecentFailures = (classification: FailureClassification, provider: string) => {
  const now = Date.now();
  recentFailures.push({ timestamp: now, classification, provider });
  
  // Clean up old records (> 1 hour)
  const cutoff = now - CLEANUP_INTERVAL_MS;
  while (recentFailures.length > 0 && recentFailures[0].timestamp < cutoff) {
    recentFailures.shift();
  }
};

export const detectFailureSpike = () => {
  const now = Date.now();
  
  // 1. Detect overall spike (> 10 failures in 1 hour)
  if (recentFailures.length > 10) {
    emitOperationalAlert('High DLQ failure rate detected', { count: recentFailures.length, window: '1 hour' });
  }

  // 2. Detect provider outage (> 5 provider failures in 5 mins)
  const fiveMinsAgo = now - 5 * 60 * 1000;
  const recentProviderFailures = recentFailures.filter(
    f => f.timestamp > fiveMinsAgo && f.classification.startsWith('PROVIDER_')
  );

  if (recentProviderFailures.length > 5) {
    // Determine which provider is failing the most
    const providerCounts = recentProviderFailures.reduce((acc, curr) => {
      acc[curr.provider] = (acc[curr.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const worstProvider = Object.keys(providerCounts).reduce((a, b) => providerCounts[a] > providerCounts[b] ? a : b);
    emitProviderOutageAlert(worstProvider, providerCounts[worstProvider]);
  }

  // 3. Detect validation regression (> 20 validation failures in 1 hour)
  const validationFailures = recentFailures.filter(f => f.classification === 'SCHEMA_VALIDATION');
  if (validationFailures.length > 20) {
    emitValidationRegressionAlert(validationFailures.length);
  }
};
