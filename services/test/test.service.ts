import {IUserTestResults, QuestionWrapper, TestQuestion, TestWrapper, UserAnswer} from "../test/test.types";
import {IUserQuiz} from "../quiz.types";
import {ICourseInfiniteScroll, TestData} from "../course.types";
import {IUpdateUserProfile} from "../auth.types";


const BACKEND_URL = 'https://api.smg.kz/en/api';


export class TestService {

  static async startTest(token: string, test_id: number) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/start/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test_id: test_id,
      }),
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Error while starting test');
    } else {
      return await response.json() as {
        user_test_id: number
      }
    }
  }

  static async endTest(token: string, user_test_id: number) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/end/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_test_id: user_test_id,
      }),
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Error while starting test');
    } else {
      return await response.json() as {
        total: number;
        amount: number;
        completion_percentage: number;
      }
    }
  }

  static async getTestQuestions(token: string, userTestId: string, isAnswered: boolean | null) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/user/answer/?user_test_id=${userTestId}&is_answered=${isAnswered}&limit=1000`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as TestWrapper;
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
        question_answer_id: question_answer_id,
        user_answer: answer
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Ошибка сервера:", errorData);
      throw new Error('Ошибка при отправке ответа на сервер');
    }

    const responseData = await response.json();
    console.log("Ответ сервера:", responseData);
    return responseData as TestWrapper;
  } catch (error) {
    console.error("Ошибка в запросе answerTestQuestion:", error);
    throw error;
  }
}

  static async changeScoreForAnswer(token: string, answer_id: number, score_for_answer: string) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/user/answer/${answer_id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        score_for_answer:score_for_answer
      }),
    });
    if (response.status !== 200) {
      throw new Error('Error while changing score for answer');
    } else {
      return await response.json() as TestWrapper
    }
  }


  static async getTestResult(token: string, userTestId: string) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/results/${userTestId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as IUserTestResults;
  }

  static async getTestResultForTeacher(token: string, testId: string, search?: string) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/results/?limit=1000&offset=0&${testId ? 'test=' + testId : ''}${search ? 'search=' + search : ''}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as ICourseInfiniteScroll<IUserTestResults>;
  }

  static async getUnscheduledTests(token: string, course: string) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/?course=${course}&limit=1000`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as ICourseInfiniteScroll<TestData>;
  }

  static async createTest(testData: {
    token: string,
    test_type: number,
    name: string,
    course: number,
    lesson?: number,
    week?: number,
    start_time?: string,
    end_time?: string,
    duration: number,
    is_visible?: boolean,
    is_superfinal?: boolean,
  }) {
    const body: TestData = {
      test_type: testData.test_type,
      name: testData.name,
      course: testData.course,
      duration: testData.duration || 0,
      description: '',
      is_visible: testData.is_visible || false,
      is_superfinal: testData.is_superfinal || false
    };

    // Add lesson or week depending on the test_type
    if (testData.test_type === 0) {
      body.lesson = testData.lesson;
    } else if (testData.test_type === 2) {
      body.week = testData.week;
    }

    // Add start_time and end_time if they are provided
    if (testData.start_time) {
      body.start_time = testData.start_time;
    }

    if (testData.end_time) {
      body.end_time = testData.end_time;
    }

    const response = await fetch(`${BACKEND_URL}/courses/tests/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${testData.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Error while creating test');
    } else {
      return await response.json() as TestData
    }
  }

  static async changeTest(token: string, testData: TestData) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/${testData.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({...testData}),
      }
    );
    if (response.status !== 200) {
      throw new Error('Error while changing test');
    }
    return await response.json()
  }

  static async changeTestVisibility(token: string, contentData: {
    id: number | undefined;
    is_visible?: boolean,
  }) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/${contentData.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(contentData),
      }
    );
    if (response.status !== 200) {
      throw new Error('Error while changing test visibilty');
    }
    return await response.json()
  }

  //getTestById функция которая может использовать юзер если он препод
  static async getTestById(token: string, testId: string) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/${testId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as TestData;
  }

  static async createQuestion(token: string, questionData: TestQuestion) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/questions/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...questionData}),
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Error while answering question');
    } else {
      return await response.json() as TestWrapper
    }
  }

  static async updateQuestion(token: string, questionId: number, questionData: TestQuestion) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/questions/${questionId}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(questionData),
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Error while updating question');
    } else {
      return await response.json() as TestQuestion;
    }
  }

  //Get test questions for constructor
  static async getConstructorQuestions(token: string, testId: string) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/questions/?test=${testId}&limit=1000&offset=0`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as QuestionWrapper;
  }

  static async deleteQuestion(token: string, questionId: number) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/questions/${questionId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    if (response.status !== 204) {
      throw new Error('Error while deleting question');
    }
  }

  static async deleteTest(token: string, testId: number) {
    const response = await fetch(`${BACKEND_URL}/courses/tests/${testId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (response.status !== 204) {
      throw new Error('Error while deleting test');
    }
  }
  
  
}