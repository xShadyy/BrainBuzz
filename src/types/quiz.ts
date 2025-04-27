export interface Category {
  id: number;
  name: string;
  description: string;
  icon_name: string;
}

export interface Question {
  id: number;
  category_id: number;
  difficulty: string;
  text: string;
  explanation: string;
}

export interface Answer {
  id: number;
  question_id: number;
  text: string;
  is_correct: boolean;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  categoryId: number;
  difficulty: string;
  date: string;
}
