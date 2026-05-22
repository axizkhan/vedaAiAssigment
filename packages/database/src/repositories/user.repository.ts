import { User } from '../models/user.model';
import { IUser, SafeUser, UserDocument } from '../types/user.types';
import { MAX_REFRESH_TOKENS } from '../constants/user.constants';

export class EMAIL_ALREADY_EXISTS extends Error {
  constructor(email: string) {
    super(`Email ${email} is already registered.`);
    this.name = 'EMAIL_ALREADY_EXISTS';
  }
}

export class UserRepository {
  static async createUser(userData: Partial<IUser>): Promise<SafeUser> {
    try {
      const user = new User(userData);
      await user.save();
      return user.toJSON() as unknown as SafeUser;
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern?.email) {
        throw new EMAIL_ALREADY_EXISTS(userData.email || '');
      }
      throw error;
    }
  }

  static async findByEmail(email: string): Promise<SafeUser | null> {
    return User.findOne({ email }).lean().exec() as unknown as Promise<SafeUser | null>;
  }

  static async findById(id: string): Promise<SafeUser | null> {
    return User.findById(id).lean().exec() as unknown as Promise<SafeUser | null>;
  }

  static async findByIdWithPassword(id: string): Promise<UserDocument | null> {
    return User.findById(id).select('+passwordHash').exec();
  }

  static async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return User.findOne({ email }).select('+passwordHash').exec();
  }

  static async addRefreshToken(userId: string, token: string): Promise<void> {
    await User.updateOne(
      { _id: userId },
      { 
        $push: { 
          refreshTokens: { 
            $each: [token],
            $slice: -MAX_REFRESH_TOKENS 
          } 
        } 
      }
    );
  }

  static async removeRefreshToken(userId: string, token: string): Promise<void> {
    await User.updateOne(
      { _id: userId },
      { $pull: { refreshTokens: token } }
    );
  }

  static async clearRefreshTokens(userId: string): Promise<void> {
    await User.updateOne(
      { _id: userId },
      { $set: { refreshTokens: [] } }
    );
  }

  static async incrementDailyGeneration(userId: string): Promise<SafeUser | null> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { dailyGenerationCount: 1 } },
      { new: true }
    );
    return user ? (user.toJSON() as unknown as SafeUser) : null;
  }

  static async resetDailyGeneration(userId: string): Promise<void> {
    await User.updateOne(
      { _id: userId },
      { 
        $set: { 
          dailyGenerationCount: 0,
          lastGenerationReset: new Date()
        } 
      }
    );
  }
}
