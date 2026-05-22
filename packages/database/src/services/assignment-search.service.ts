import { AssignmentRepository } from '../repositories/assignment.repository';
import { AssignmentFilters } from '../types/assignment-query.types';

export class AssignmentSearchService {
  static async search(filters: AssignmentFilters) {
    return AssignmentRepository.paginateAssignments(filters);
  }
}
