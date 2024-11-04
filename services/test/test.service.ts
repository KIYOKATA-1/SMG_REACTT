import { IUserTestResults, TestWrapper, UserAnswer } from "../test/test.types";

const BACKEND_URL = 'https://api.smg.kz/en/api';

export class TestService {
  static async startTest(token: string, test_id: number): Promise<{ user_test_id: number }> {
    try {
      const response = await fetch(`${BACKEND_URL}/courses/tests/start/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test_id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error starting test:', response.status, errorText);
        throw new Error(`Error while starting test: ${errorText}`);
      }

      const data = await response.json();
      if (!data.user_test_id) {
        throw new Error("API response structure for 'startTest' is invalid: missing 'user_test_id'");
      }
      return data;
    } catch (error) {
      console.error('Error starting test:', error);
      throw error;
    }
  }

  static async endTest(token: string, user_test_id: number) {
    try {
      const response = await fetch(`${BACKEND_URL}/courses/tests/end/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_test_id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error ending test:', response.status, errorText);
        throw new Error(`Error while ending test: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error while ending test:', error);
      throw error;
    }
  }

  static async getTestQuestions(token: string, userTestId: string, isAnswered: boolean | null): Promise<TestWrapper> {
    try {
      const response = await fetch(`${BACKEND_URL}/courses/tests/user/answer/?user_test_id=${userTestId}&is_answered=${isAnswered}&limit=1000`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching test questions:', response.status, errorText);
        throw new Error(`Error while fetching test questions: ${errorText}`);
      }

      return await response.json() as TestWrapper;
    } catch (error) {
      console.error('Error fetching test questions:', error);
      throw error;
    }
  }

  static async answerTestQuestion(token: string, question_answer_id: number, answer: UserAnswer) {
    try {
      const response = await fetch(`${BACKEND_URL}/courses/tests/answer/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question_answer_id,
          user_answer: answer,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error answering question:', response.status, errorText);
        throw new Error(`Error while answering question: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error while answering question:', error);
      throw error;
    }
  }

  static async getTestResult(token: string, userTestId: string): Promise<IUserTestResults> {
    try {
      const response = await fetch(`${BACKEND_URL}/courses/tests/results/${userTestId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching test result:', response.status, errorText);
        throw new Error(`Error while fetching test result: ${errorText}`);
      }

      return await response.json() as IUserTestResults;
    } catch (error) {
      console.error('Error fetching test result:', error);
      throw error;
    }
  }
  static async changeScoreForAnswer(token: string, questionId: number, score: string) {
    try {
      const response = await fetch(`${BACKEND_URL}/courses/tests/answer/${questionId}/score`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error updating score:', response.status, errorText);
        throw new Error(`Error updating score: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating score:', error);
      throw error;
    }
  }
}