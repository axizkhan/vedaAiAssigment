import mongoose, { Schema, Document, Types } from 'mongoose';
import { ASSIGNMENT_EVENT_COLLECTION_NAME } from '../constants/assignment.constants';

export interface IAssignmentEvent {
  assignmentId: Types.ObjectId;
  eventType: string;
  payload?: any;
  createdAt: Date;
}

const assignmentEventSchema = new Schema<IAssignmentEvent>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
    eventType: { type: String, required: true },
    payload: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    collection: ASSIGNMENT_EVENT_COLLECTION_NAME,
  }
);

export const AssignmentEvent = mongoose.model<IAssignmentEvent>('AssignmentEvent', assignmentEventSchema);
