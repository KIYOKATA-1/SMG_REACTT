import {
  ContentData,
  ContentWrapper, ICourse,
  ICourseDetails,
  ICourseInfiniteScroll, ISuperFinal,
  IUserCourse, 
  TestData,
  ICourseWeek,
  WeekLessons,
} from "../course/course.types";


const BACKEND_URL = 'https://api.smg.kz/en/api';

export class CourseService {

  static async getMyCourses(token: string, page: number = 0) {
    const response = await fetch(`${BACKEND_URL}/courses/user/?limit=8&offset=${page}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as ICourseInfiniteScroll<IUserCourse>
  }

  static async getCourses(token: string, page: number = 0) {
    const response = await fetch(`${BACKEND_URL}/courses?limit=1000&offset=${page}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as ICourseInfiniteScroll<ICourse>
  }

  static async getCourseById(token: string, course_id: string) {
    const response = await fetch(`${BACKEND_URL}/courses/${course_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as ICourseDetails
  }

  static async getCourseByIdWithoutInfo(token: string, course_id: string) {
    const response = await fetch(`${BACKEND_URL}/courses/getcourse/${course_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json() as ICourse
  }

  static async startLessonContent(token: string, content_id: number) {
    const response = await fetch(`${BACKEND_URL}/courses/lessons/content/start/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content_id: content_id,
      }),
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Error while starting content');
    } else {
      return await response.json() as ContentWrapper<ContentData>
    }
  }

  static async endLessonContent(token: string, content_id: number) {
    const response = await fetch(`${BACKEND_URL}/courses/lessons/content/end/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content_id: content_id,
      }),
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Error while ending content');
    } else {
      return await response.json() as ContentWrapper<ContentData>
    }
  }
}