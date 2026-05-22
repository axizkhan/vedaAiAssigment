import mongoose, { Schema } from 'mongoose';
import { ASSIGNMENT_EVENT_COLLECTION_NAME, MAX_METADATA_SIZE } from '../constants/assignment-event.constants';
import { ASSIGNMENT_EVENT_ACTIONS } from '../constants/assignment-event-actions.constants';
import { IAssignmentEvent } from '../types/assignment-event.types';
import { sanitizeEventMetadata } from '../utils/event-metadata-sanitizer';

function metadataFitsLimit(metadata: unknown): boolean {
  return Buffer.byteLength(JSON.stringify(metadata ?? {}), 'utf8') <= MAX_METADATA_SIZE;
}

export const assignmentEventSchema = new Schema<IAssignmentEvent>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true, immutable: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true, immutable: true },
    action: { type: String, enum: ASSIGNMENT_EVENT_ACTIONS, required: true, index: true, immutable: true },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
      immutable: true,
      validate: {
        validator: metadataFitsLimit,
        message: `Assignment event metadata exceeds ${MAX_METADATA_SIZE} bytes.`,
      },
    },
    createdAt: { type: Date, default: Date.now, immutable: true },
  },
  {
    timestamps: false,
    versionKey: false,
    strict: true,
    minimize: false,
    collection: ASSIGNMENT_EVENT_COLLECTION_NAME,
  }
);

assignmentEventSchema.index({ assignmentId: 1, createdAt: -1 });
assignmentEventSchema.index({ userId: 1, createdAt: -1 });
assignmentEventSchema.index({ action: 1, createdAt: -1 });
assignmentEventSchema.index({ 'metadata.traceId': 1, createdAt: -1 }, { sparse: true });
assignmentEventSchema.index({ 'metadata.jobId': 1, createdAt: -1 }, { sparse: true });

assignmentEventSchema.pre('validate', function (next) {
  this.metadata = sanitizeEventMetadata(this.metadata, typeof this.metadata?.traceId === 'string' ? this.metadata.traceId : undefined);
  next();
});

assignmentEventSchema.pre('save', function (next) {
  if (!this.isNew) return next(new Error('Assignment events are immutable and cannot be edited.'));
  next();
});

assignmentEventSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate', 'replaceOne'], function (next) {
  next(new Error('Assignment events are immutable and cannot be updated.'));
});

assignmentEventSchema.pre(['deleteOne', 'deleteMany', 'findOneAndDelete'], function (next) {
  next(new Error('Assignment events are append-only and cannot be deleted through normal application flow.'));
});

export const AssignmentEvent = mongoose.model<IAssignmentEvent>('AssignmentEvent', assignmentEventSchema);
