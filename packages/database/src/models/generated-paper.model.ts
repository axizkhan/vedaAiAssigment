import mongoose, { Schema } from 'mongoose';
import { GENERATED_PAPER_COLLECTION_NAME, DEFAULT_ACTIVE_VERSION } from '../constants/generated-paper.constants';
import { GeneratedPaperModel, IGeneratedPaper, IPaperVersion } from '../types/generated-paper.types';
import { paperVersionSchema } from './paper-version.model';

const IMMUTABLE_VERSION_UPDATE_PATTERN = /^versions(\.|\$|\[)|^versions$/;
const PDF_METADATA_UPDATE_PATTERN = /^versions\.\$\.pdf(S3Key|GeneratedAt)$/;

function validateActiveVersionExists(activeVersion: number, versions: IPaperVersion[]): boolean {
  return versions.some((version) => version.version === activeVersion);
}

function rejectsImmutableVersionUpdate(update: Record<string, unknown>): boolean {
  const operations = ['$set', '$unset', '$inc', '$mul', '$rename', '$pop', '$pull', '$pullAll'];

  for (const operation of operations) {
    const payload = update[operation];
    if (!payload || typeof payload !== 'object') continue;

    for (const path of Object.keys(payload as Record<string, unknown>)) {
      if (PDF_METADATA_UPDATE_PATTERN.test(path)) continue;
      if (IMMUTABLE_VERSION_UPDATE_PATTERN.test(path)) return true;
    }
  }

  const pushPayload = update.$push;
  if (pushPayload && typeof pushPayload === 'object') {
    for (const path of Object.keys(pushPayload as Record<string, unknown>)) {
      if (path !== 'versions') return true;
    }
  }

  return Object.keys(update).some((path) => IMMUTABLE_VERSION_UPDATE_PATTERN.test(path));
}

export const generatedPaperSchema = new Schema<IGeneratedPaper, GeneratedPaperModel>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    activeVersion: {
      type: Number,
      required: true,
      default: DEFAULT_ACTIVE_VERSION,
      min: 1,
      validate: Number.isInteger,
    },
    versions: {
      type: [paperVersionSchema],
      required: true,
      validate: [
        {
          validator: (versions: IPaperVersion[]) => versions.length > 0,
          message: 'Generated paper must contain at least one version.',
        },
        {
          validator: (versions: IPaperVersion[]) => new Set(versions.map((version) => version.version)).size === versions.length,
          message: 'Paper version numbers must be unique.',
        },
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
    minimize: false,
    collection: GENERATED_PAPER_COLLECTION_NAME,
  }
);

generatedPaperSchema.index({ assignmentId: 1 }, { unique: true });
generatedPaperSchema.index({ updatedAt: -1 });

generatedPaperSchema.pre('validate', function (next) {
  if (!validateActiveVersionExists(this.activeVersion, this.versions)) {
    return next(new Error('Active version must exist in generated paper versions.'));
  }

  next();
});

generatedPaperSchema.pre('save', function (next) {
  if (!this.isNew && this.isModified('versions')) {
    return next(new Error('Generated paper versions are immutable. Append versions through the repository.'));
  }

  next();
});

generatedPaperSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
  const update = this.getUpdate();
  if (Array.isArray(update)) {
    return next(new Error('Generated paper update pipelines are disabled to protect immutable version history.'));
  }

  if (update && rejectsImmutableVersionUpdate(update as Record<string, unknown>)) {
    return next(new Error('Generated paper version content is immutable. Use appendVersion or updatePdfMetadata.'));
  }

  next();
});

export const GeneratedPaper = mongoose.model<IGeneratedPaper, GeneratedPaperModel>('GeneratedPaper', generatedPaperSchema);
