import { UserRepository } from '../repositories/user.repository';
import { UserRole } from '../types/user.types';
import { hashPassword } from '../utils/password';
import { SeedLogger } from './seed-logger';
import { SeedContext, SeedResult } from './seed-types';
import { measureExecutionTime } from './seed-utils';

export async function seedDefaultAdmin(context: SeedContext, seedLogger: SeedLogger): Promise<SeedResult> {
  const { result, durationMs } = await measureExecutionTime(async () => {
    const existingAdmin = await UserRepository.findFirstAdmin();
    if (existingAdmin) {
      seedLogger.info('Default admin seed skipped because an admin already exists.', {
        adminUserId: existingAdmin._id.toString(),
      });
      return { adminCreated: false, adminUserId: existingAdmin._id.toString() };
    }

    const passwordHash = await hashPassword(context.adminPassword);
    const admin = await UserRepository.createUser({
      email: context.adminEmail,
      passwordHash,
      name: context.adminName,
      role: UserRole.ADMIN,
      refreshTokens: [],
      dailyGenerationCount: 0,
      lastGenerationReset: new Date(),
    });

    seedLogger.info('Default admin user created.', {
      adminUserId: admin._id.toString(),
      adminEmail: context.adminEmail,
    });

    return { adminCreated: true, adminUserId: admin._id.toString() };
  });

  return {
    name: 'seed-admin',
    status: result.adminCreated ? 'success' : 'skipped',
    durationMs,
    metadata: result,
  };
}
