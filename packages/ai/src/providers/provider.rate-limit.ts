// Advanced rate limiting structures would typically use Redis.
// This is an abstraction for the logic.
export class ProviderRateLimiter {
  private cooldowns: Map<string, number> = new Map();

  public markCooldown(provider: string, retryAfterMs: number = 5000): void {
    this.cooldowns.set(provider, Date.now() + retryAfterMs);
  }

  public isCoolingDown(provider: string): boolean {
    const cooldownEnd = this.cooldowns.get(provider);
    if (!cooldownEnd) return false;
    
    if (Date.now() > cooldownEnd) {
      this.cooldowns.delete(provider);
      return false;
    }
    return true;
  }
}

export const globalRateLimiter = new ProviderRateLimiter();
