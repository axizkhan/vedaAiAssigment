import { DAILY_GENERATION_RESET_HOURS } from '../constants/user.constants';

export const shouldResetDailyQuota = (lastReset: Date): boolean => {
  const now = new Date();
  const resetTime = new Date(lastReset);
  resetTime.setUTCHours(resetTime.getUTCHours() + DAILY_GENERATION_RESET_HOURS);
  return now.getTime() >= resetTime.getTime();
};
