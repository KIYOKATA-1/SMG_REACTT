import { IExamResults, IExamStudentResultResponse, UserRoadmapData } from "./edugress.types";

const BACKEND_URL = 'https://api.smg.kz/en/api';

export class EdugressService {
    static async getFiles(token: string): Promise<{ results: { id: number; name: string; date: string }[] }> {
        const response = await fetch(`${BACKEND_URL}/edugress/exams/?limit=1000`, {
          method: 'GET',
          headers: { Authorization: `Token ${token}` },
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Ошибка при загрузке файлов');
        }
      
        return await response.json();
      }
      

  static async getStudentProgress(testId: number, token: string): Promise<IExamResults> {
    const response = await fetch(`${BACKEND_URL}/edugress/exams/${testId}/main/student/`, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка при загрузке данных прогресса студента');
    }

    return await response.json();
  }

  static async getExamResults(fileId: number, token: string) {
    const response = await fetch(`${BACKEND_URL}/edugress/exams/${fileId}/main/`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка при получении результатов теста');
    }

    return await response.json();
  }
  static async getStudentResults(testId: number, token: string): Promise<IExamStudentResultResponse> {
    const response = await fetch(`${BACKEND_URL}/edugress/exams/${testId}/results/student/`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка при получении результатов студентов');
    }

    
    return await response.json();
  }

  static async getUserRoadmap(token: string): Promise<UserRoadmapData[]> {
    const response = await fetch(`${BACKEND_URL}/edugress/roadmap/?limit=1000&offset=0`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка при получении данных роадмапа');
    }
  
    return await response.json() as UserRoadmapData[];
  }
}
