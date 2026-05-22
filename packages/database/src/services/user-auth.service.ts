import { UserRepository } from '../repositories/user.repository';
import { SafeUser } from '../types/user.types';

export class UserAuthService {
  static async findByEmail(email: string): Promise<SafeUser | null> {
    return UserRepository.findByEmail(email.toLowerCase().trim());
  }

  static async findByEmailWithPassword(email: string) {
    return UserRepository.findByEmailWithPassword(email.toLowerCase().trim());
  }

  static async findById(id: string): Promise<SafeUser | null> {
    return UserRepository.findById(id);
  }

  static async createUser(input: Parameters<typeof UserRepository.createUser>[0]): Promise<SafeUser> {
    return UserRepository.createUser(input);
  }

  static async addRefreshToken(userId: string, token: string): Promise<void> {
    await UserRepository.addRefreshToken(userId, token);
  }

  static async replaceRefreshToken(userId: string, oldToken: string, newToken: string): Promise<boolean> {
    return UserRepository.replaceRefreshToken(userId, oldToken, newToken);
  }

  static async removeRefreshToken(userId: string, token: string): Promise<void> {
    await UserRepository.removeRefreshToken(userId, token);
  }

  static async clearRefreshTokens(userId: string): Promise<void> {
    await UserRepository.clearRefreshTokens(userId);
  }

  static async hasRefreshToken(userId: string, token: string): Promise<boolean> {
    return UserRepository.hasRefreshToken(userId, token);
  }
}
