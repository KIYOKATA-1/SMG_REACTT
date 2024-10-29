// course.service.ts
import { ContentData, ContentWrapper, ICourseDetails } from './course.types';

const API_URL = 'https://api.smg.kz/en/api';

export const CourseService = {
  getMyCourses: async () => {
    try {
      const response = await fetch(`${API_URL}/courses`);
      const data = await response.json();
      console.log('Курсы успешно загружены:', data);
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке курсов:', error);
      throw error;
    }
  },

  getCourseById: async (token: string, course_id: string): Promise<ICourseDetails> => {
    try {
      const response = await fetch(`${API_URL}/courses/${course_id}`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      const data = await response.json();
      console.log('Курс успешно загружен:', data);
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке курса:', error);
      throw error;
    }
  },

  endLessonContent: async (token: string, content_id: number): Promise<ContentWrapper<ContentData>> => {
    try {
      const response = await fetch(`${API_URL}/courses/lessons/content/end/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content_id }),
      });

      if (![200, 201].includes(response.status)) {
        throw new Error('Error while ending content');
      }

      const data = await response.json();
      console.log('Контент завершен:', data);
      return data;
    } catch (error) {
      console.error('Ошибка завершения контента:', error);
      throw error;
    }
  },
};