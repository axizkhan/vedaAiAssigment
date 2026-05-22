import { UserRepository } from '../repositories/user.repository';
import { shouldResetDailyQuota } from '../utils/reset-daily-count';
import { apiEnv } from '@assessment-ai/config';
import { SafeUser } from '../types/user.types';

export class UserQuotaService {
  static async checkAndResetQuota(user: SafeUser): Promise<SafeUser> {
    if (shouldResetDailyQuota(user.lastGenerationReset)) {
      await UserRepository.resetDailyGeneration(user._id.toString());
      return (await UserRepository.findById(user._id.toString()))!;
    }
    return user;
  }

  static async canGenerateAssessment(userId: string): Promise<boolean> {
    let user = await UserRepository.findById(userId);
    if (!user) return false;

    user = await this.checkAndResetQuota(user);

    return user.dailyGenerationCount < apiEnv.AI_GENERATION_LIMIT_PER_DAY;
  }

  static async incrementUserQuota(userId: string): Promise<SafeUser | null> {
    let user = await UserRepository.findById(userId);
    if (!user) return null;

    await this.checkAndResetQuota(user);
    
    return UserRepository.incrementDailyGeneration(userId);
  }
}
