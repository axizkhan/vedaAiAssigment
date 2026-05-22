import { SafeUser, UserDocument, UserRole } from '@assessment-ai/database';
import { AuthenticatedUser } from './auth.types';

type UserLike = SafeUser | UserDocument;

export function mapUserToAuthUser(user: UserLike): AuthenticatedUser {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
    createdAt: user.createdAt,
  };
}
