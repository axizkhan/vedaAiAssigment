import { Paper } from "../types/paper.types";

export const fetchPaper = async (paperId: string): Promise<Paper> => {
  // MOCK: Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // MOCK: Return realistic generated paper
  return {
    id: paperId,
    title: "Mid-Term Physics Assessment",
    subject: "Physics",
    durationMinutes: 90,
    totalMarks: 50,
    instructions: [
      "All questions are compulsory.",
      "Use of calculators is permitted.",
      "Show all working steps for long answer questions."
    ],
    createdAt: new Date().toISOString(),
    sections: [
      {
        id: "sec_1",
        title: "Multiple Choice",
        instructions: "Choose the correct option for each question.",
        totalMarks: 10,
        questions: [
          { id: "q_1", number: "1", text: "What is the SI unit of Force?", marks: 2, difficulty: "easy" },
          { id: "q_2", number: "2", text: "Which of the following describes Newton's Third Law?", marks: 2, difficulty: "easy" },
          { id: "q_3", number: "3", text: "Calculate the momentum of a 5kg object moving at 2m/s.", marks: 2, difficulty: "moderate" },
        ]
      },
      {
        id: "sec_2",
        title: "Short Answer",
        instructions: "Answer in 2-3 sentences.",
        totalMarks: 20,
        questions: [
          { id: "q_4", number: "4", text: "Explain the concept of inertia with an example.", marks: 5, difficulty: "moderate" },
          { id: "q_5", number: "5", text: "Derive the equation of motion v = u + at.", marks: 5, difficulty: "hard" },
        ]
      }
    ]
  };
};
