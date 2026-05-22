import { ProviderHealthResult } from './provider.types';

export class ProviderHealthTracker {
  private healthStates: Map<string, ProviderHealthResult> = new Map();

  public updateHealth(provider: string, isHealthy: boolean, latencyMs: number, error?: string): void {
    this.healthStates.set(provider, {
      isHealthy,
      latencyMs,
      error,
      lastChecked: new Date()
    });
  }

  public getHealth(provider: string): ProviderHealthResult | undefined {
    return this.healthStates.get(provider);
  }
}

export const globalHealthTracker = new ProviderHealthTracker();
