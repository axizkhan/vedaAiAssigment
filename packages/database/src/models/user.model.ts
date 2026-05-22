import mongoose, { Schema } from 'mongoose';
import { IUser, IUserMethods, UserModel, UserRole } from '../types/user.types';
import { USER_COLLECTION_NAME, MAX_REFRESH_TOKENS } from '../constants/user.constants';
import { comparePassword } from '../utils/password';

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      immutable: true,
      maxlength: 255,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.TEACHER,
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
    dailyGenerationCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastGenerationReset: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
    collection: USER_COLLECTION_NAME,
    toJSON: {
      transform: function (doc, ret) {
        delete (ret as any).passwordHash;
        delete (ret as any).refreshTokens;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete (ret as any).passwordHash;
        delete (ret as any).refreshTokens;
        return ret;
      },
    },
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

userSchema.pre('save', function (next) {
  if (this.isModified('refreshTokens') && this.refreshTokens.length > MAX_REFRESH_TOKENS) {
    this.refreshTokens = this.refreshTokens.slice(-MAX_REFRESH_TOKENS);
  }
  
  // Dedup tokens
  if (this.isModified('refreshTokens')) {
    this.refreshTokens = Array.from(new Set(this.refreshTokens));
  }
  
  next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return comparePassword(password, this.passwordHash);
};

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
