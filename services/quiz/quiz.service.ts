import {IProducts, IUserQuestion, IUserQuiz, IInfiniteScroll} from "./quiz.types";

const BACKEND_URL = 'https://api.smg.kz/en/api';


export class QuizService {

  static async buyQuiz(token: string, quiz_id: number) {
    const response = await fetch(`${BACKEND_URL}/main/quiz/buy/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({
        quiz_id,
      }),
    });
    return await response.json() as {
      user_quiz: IUserQuiz;
    };
  }

  static async startQuiz(token: string, quizId: number) {
    const response = await fetch(`${BACKEND_URL}/main/quiz/start/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_quiz_id: quizId,
      }),
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Error while starting quizzes');
    } else {
      return await response.json() as {
        user_quiz: IUserQuiz;
      };
    }
  }

  static async confirmStartQuiz(token: string, quizId: number) {
    const response = await fetch(`${BACKEND_URL}/main/quiz/start/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_quiz_id: quizId,
      }),
    });
    if (response.status !== 200) {
      throw new Error('Error while starting quizzes');
    } else {
      return await response.json() as {
        user_quiz: IUserQuiz;
      };
    }
  }

  static async endQuiz(token: string, userQuizId: number) {
    const response = await fetch(`${BACKEND_URL}/main/quiz/end/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_quiz_id: userQuizId,
      }),
    });
    if (response.status !== 200) {
      throw new Error('Error while starting quizzes');
    } else {
      return await response.json() as {
        user_quiz: IUserQuiz;
      };
    }
  }

  static async getQuizzes(token: string, page: number = 1) {
    const response = await fetch(`${BACKEND_URL}/main/quizzes/?page_size=10&page=${page}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as IInfiniteScroll<IUserQuiz>;
  }

  static async getMyQuizzes(token: string, page: number = 0) {
    const response = await fetch(`${BACKEND_URL}/user/quizzes/?limit=4&offset=${page}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as IInfiniteScroll<IUserQuiz>
  }

  static async getQuestions(token: string, userQuizId: number, isAnswered = false) {
    const endpoint = `${BACKEND_URL}/main/quiz/questions/?user_quiz=${userQuizId}&is_answered=${isAnswered}&limit=1000`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as IInfiniteScroll<IUserQuestion>;
  }

  static async getQuizStatus(token: string, userQuizId: number) {
    const endpoint = `${BACKEND_URL}/main/quiz/${userQuizId}/status/`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as IUserQuiz;
  }

  static async getQuizResult(token: string, userQuizId: number) {
    const response = await fetch(`${BACKEND_URL}/main/quiz/${userQuizId}/result/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as IUserQuiz;
  }

  static async answerQuestion(token: string, questionId: number, answer: 1 | 2 | 3 | 4) {
    const response = await fetch(`${BACKEND_URL}/main/quiz/answer/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_answer_id: questionId,
        answer_option: answer,
      }),
    });
    if (response.status !== 200) {
      return {
        success: false,
      }
    } else {
      return {
        success: true,
      }
    }
  }
}