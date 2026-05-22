import { Document, Model, Types } from 'mongoose';

export enum UserRole {
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

export interface IUser {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  refreshTokens: string[];
  dailyGenerationCount: number;
  lastGenerationReset: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export interface UserModel extends Model<IUser, {}, IUserMethods> {}

export type UserDocument = Document<Types.ObjectId, {}, IUser> & IUser & IUserMethods & { _id: Types.ObjectId };

export type SafeUser = Omit<IUser, 'passwordHash' | 'refreshTokens'> & { _id: Types.ObjectId | string };
