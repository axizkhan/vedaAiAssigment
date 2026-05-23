import type {
  Assignment,
  FetchAssignmentsParams,
  PaginatedResponse,
} from "../types/dashboard.types";

// Mock data generator
const generateMockAssignments = (count: number): Assignment[] => {
  const statuses = ["draft", "queued", "generating", "completed", "failed"] as const;
  const subjects = ["Mathematics", "Physics", "Computer Science", "Biology", "Literature"];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `assign-${i}-${Date.now()}`,
    title: `Assessment Assignment ${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    subject: subjects[Math.floor(Math.random() * subjects.length)],
    dueDate: new Date(Date.now() + 86400000 * (i % 10)).toISOString().split("T")[0],
    questionCount: Math.floor(Math.random() * 20) + 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

// Simulated database
const mockDatabase = generateMockAssignments(150);

export const DashboardService = {
  async fetchAssignments(
    params: FetchAssignmentsParams
  ): Promise<PaginatedResponse<Assignment>> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    let filteredData = [...mockDatabase];

    // Search
    if (params.search) {
      const q = params.search.toLowerCase();
      filteredData = filteredData.filter((a) =>
        a.title.toLowerCase().includes(q) || a.subject?.toLowerCase().includes(q)
      );
    }

    // Status Filter
    if (params.status && params.status.length > 0) {
      filteredData = filteredData.filter((a) => params.status!.includes(a.status));
    }

    // Subject Filter
    if (params.subject && params.subject.length > 0) {
      filteredData = filteredData.filter((a) => a.subject && params.subject!.includes(a.subject));
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 12;
    const total = filteredData.length;
    const totalPages = Math.ceil(total / limit);

    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  async deleteAssignment(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockDatabase.findIndex((a) => a.id === id);
    if (index > -1) {
      mockDatabase.splice(index, 1);
    }
  },
};
