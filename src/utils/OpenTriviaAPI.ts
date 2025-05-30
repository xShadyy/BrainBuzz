export interface OpenTriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface OpenTriviaResponse {
  response_code: number;
  results: OpenTriviaQuestion[];
}

export interface ProcessedQuestion {
  id: number;
  category_id: number;
  difficulty: string;
  text: string;
  answers: {
    id: number;
    text: string;
    is_correct: boolean;
  }[];
}

/**
 * Fetch questions from Open Trivia Database
 * @param categoryId - Open Trivia DB category ID
 * @param difficulty - Question difficulty ('easy', 'medium', 'hard')
 * @param amount - Number of questions to fetch (default: 10)
 * @returns Promise<OpenTriviaQuestion[]>
 */
export const fetchQuestions = async (
  categoryId: number,
  difficulty: string,
  amount: number = 10,
): Promise<OpenTriviaQuestion[]> => {
  try {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple&encode=url3986`;

    const response = await fetch(url);
    const data: OpenTriviaResponse = await response.json();

    if (data.response_code === 0) {
      return data.results;
    } else {
      throw new Error(getErrorMessage(data.response_code));
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

/**
 * Decode URL-encoded strings from Open Trivia DB
 * @param text - URL-encoded text
 * @returns Decoded text
 */
const decodeText = (text: string): string => {
  try {
    return decodeURIComponent(text);
  } catch (error) {
    console.error('Error decoding text:', error);
    return text;
  }
};

/**
 * Process and decode question data from Open Trivia DB
 * @param data - Raw question data from API
 * @param categoryId - Category ID for consistency
 * @returns Processed questions with shuffled answers
 */
export const decodeQuestionData = (
  data: OpenTriviaQuestion[],
  categoryId: number,
): ProcessedQuestion[] => {
  return data.map((item, index) => {
    const allAnswers = [...item.incorrect_answers, item.correct_answer];
    const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

    return {
      id: index,
      category_id: categoryId,
      difficulty: item.difficulty,
      text: decodeText(item.question),
      answers: shuffledAnswers.map((answer, i) => ({
        id: i,
        text: decodeText(answer),
        is_correct: answer === item.correct_answer,
      })),
    };
  });
};

/**
 * Get error message based on Open Trivia DB response code
 * @param responseCode - Response code from API
 * @returns Error message
 */
const getErrorMessage = (responseCode: number): string => {
  switch (responseCode) {
    case 1:
      return 'No results found. Try a different category or difficulty.';
    case 2:
      return 'Invalid parameter. Please check your request.';
    case 3:
      return 'Token not found. Please try again.';
    case 4:
      return 'Token expired. Please try again.';
    case 5:
      return 'Rate limit exceeded. Please wait before making another request.';
    default:
      return 'Unknown error occurred. Please try again.';
  }
};

/**
 * Validate if a category has enough questions for the specified difficulty
 * @param categoryId - Open Trivia DB category ID
 * @param difficulty - Question difficulty
 * @returns Promise<boolean>
 */
export const validateCategoryQuestions = async (
  categoryId: number,
  difficulty: string,
): Promise<boolean> => {
  try {
    const questions = await fetchQuestions(categoryId, difficulty, 1);
    return questions.length > 0;
  } catch (error) {
    return false;
  }
};
