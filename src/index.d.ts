interface Quiz {
  description: string;
  id: number;
  title: string;
  created_by: number;
  is_public: boolean;
  created_at: Date;
  is_removed: boolean | null;
  likes: number;
  rating_avg: number;
  Question: Question[];
}

interface Question {
  id: number;
  quiz_id: number;
  content: string | null;
  partial_points: boolean | null;
  negative_points: boolean | null;
  max_points: number;
  Answer: Answer[];
}

interface Answer {
  id: number;
  content: string;
  question_id: number;
  is_correct: boolean;
}

interface Ranking {
  uuid: string;
  username: string;
  points: number;
}