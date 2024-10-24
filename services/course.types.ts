export interface ICourseInfiniteScroll<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ICourse {
  id: number;
  teachers: ITeacher[];
  is_bought: boolean;
  students: {
    count: number;
    avatars: string[];
  }
  order: number;
  name: string;
  type: number;
  cost: number;
  description: string;
  modules: number;
  length: number;
  image: string;
}

export interface IUserCourse {
  id: number;
  course: ICourseDetails;
  order: number;
  created: string;
  updated: string;
  is_active: boolean;
  is_deleted: boolean;
  is_ended: boolean;
  final_score: number;
  completion_percentage: number;
  students: {
    count: number;
    avatars: string[];
  }
  user?: number;
  teachers: ITeacher[];
}

export interface ICourseDetails {
  id: number;
  teachers: ITeacher[]
  course_weeks?: ICourseWeek[];
  order: number;
  name: string;
  type: number;
  cost: number;
  description: string;
  is_bought?: boolean;
  students: {
    count: number;
    avatars: string[];
  }
}

export interface ITeacher {
  id: number;
  first_name: string;
  last_name: string;
}

export interface ICourseWeek {
  id: number | null;
  lessons_data: CourseWeekLessons[];
  name: string;
  user_week_completion: number;
  week_number: number;
  week_test_data: WeekTestData;
}

export interface CourseWeekLessons {
  course: number;
  description: string;
  id: number;
  order: number;
  lectures_data: ContentData[];
  lesson_week: {
    id: number;
    order: number;
  }
  name: string;
  test_data: TestData[];
  video_lessons_data: ContentData[];
}

export interface ContentData {
  course: number;
  description: string;
  file: string | null;
  id: number;
  is_ended: boolean | null;
  is_visible: boolean;
  name: string;
  order: number;
  text: string;
  time_to_pass: string | null;
  type: number;
  video_480?: string;
  video_720?: string;
  video_1080?: string;
}


export interface TestData {
  week?: number;
  description: string;
  duration: number | null;
  end_time?: string | null; // Optional
  id?: number; // Optional
  is_visible: boolean;
  name: string;
  order?: number; // Optional
  question_count?: number; // Optional
  score?: number; // Optional
  start_time?: string | null; // Optional
  test_type: number;
  user_test_ended?: boolean | null;
  user_test_id?: number | null;
  course?: number;
  lesson?: number;
  is_superfinal?: boolean;
}


export interface WeekTestData {
  description: string;
  duration: string | null;
  end_time: string | null;
  id: number;
  is_visible: boolean;
  name: string;
  order: number;
  question_count: number;
  score: number;
  start_time: string | null;
  test_type: number;
  user_test_ended: boolean | null;
  user_test_id: number | null;
}

export interface ContentWrapper<T> {
  content: T;
  user_content_id: number;
  user_week_id: number;
  user_content_is_ended: number;
}

export interface ISuperFinal {
  id: number;
  max_score: number;
  user: {
    id: number;
    full_name: string;
    phone?: string;
    photo?: string|null;
  }
  courses?: {
    course_id: number;
    course_name: string;
    max_score: number;
    user_score: number;
  }[];
  order: number;
  score: string;
  month: number;
  product: {
    id:number;
    name:string;
  };
}
