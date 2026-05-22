import { IAssignment } from '@assessment-ai/database';
import { Types } from 'mongoose';
import { AssignmentDTO } from './assignment.types';

type AssignmentLike = IAssignment & { _id?: Types.ObjectId | string };

export function mapAssignmentToDTO(assignment: AssignmentLike): AssignmentDTO {
  return {
    id: assignment._id?.toString() ?? '',
    title: assignment.title,
    subject: assignment.subject,
    ...(assignment.dueDate ? { dueDate: assignment.dueDate } : {}),
    ...(assignment.instructions ? { instructions: assignment.instructions } : {}),
    questionTypes: assignment.questionTypes,
    totalQuestions: assignment.totalQuestions,
    totalMarks: assignment.totalMarks,
    difficultyDistribution: assignment.difficultyDistribution,
    status: assignment.status,
    createdAt: assignment.createdAt,
    updatedAt: assignment.updatedAt,
  };
}
