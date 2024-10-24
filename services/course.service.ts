import axios from 'axios';
import { ICourseDetails, ContentData } from './course.types';

const API_URL = 'https://api.smg.kz/en/api'; 

export const CourseService = {
  getMyCourses: async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      console.log('Курсы успешно загружены:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке курсов:', error);
      throw error;
    }
  },

  getCourseById: async (token: string, course_id: string): Promise<ICourseDetails> => {
    console.log(`Запрос курса: courseId=${course_id}`);
    try {
      const response = await axios.get(`${API_URL}/courses/${course_id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log('Курс успешно загружен:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при загрузке курса:', error.response?.data || error.message);
      } else {
        console.error('Неизвестная ошибка:', error);
      }
      throw error;
    }
  },

  getLectureById: async (token: string, courseId: string, lectureId: string): Promise<ContentData> => {
    const url = `${API_URL}/course/${courseId}/lecture/${lectureId}`;
    console.log(`Запрос лекции по URL: ${url}`);

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log('Лекция успешно загружена:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при загрузке лекции:', error.response?.data || error.message);
      } else {
        console.error('Неизвестная ошибка:', error);
      }
      throw error;
    }
  },

  getVideoLessonById: async (token: string, courseId: string, videoLessonId: string): Promise<ContentData> => {
    const url = `${API_URL}/course/${courseId}/videoLesson/${videoLessonId}`;
    console.log(`Запрос видеоурока по URL: ${url}`);

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log('Видеоурок успешно загружен:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при загрузке видеоурока:', error.response?.data || error.message);
      } else {
        console.error('Неизвестная ошибка:', error);
      }
      throw error;
    }
  },

  createWeekLesson: async (
    token: string,
    name: string,
    weekId: number,
    courseId: number
  ): Promise<any> => {
    const url = `${API_URL}/courses/${courseId}/weeks/${weekId}/lessons`;
    console.log(`Создание урока по URL: ${url}`);

    try {
      const response = await axios.post(
        url,
        { name },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Урок успешно создан:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при создании урока:', error.response?.data || error.message);
      } else {
        console.error('Неизвестная ошибка:', error);
      }
      throw error;
    }
  },
};
