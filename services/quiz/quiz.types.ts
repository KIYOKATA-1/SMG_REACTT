import {KeyObject} from "crypto";
import {ICourse} from "../course/course.types";
import {IDiscount} from "../products/products.types";

export interface IQuizResult {
  "Рабочие": Record<string, number>;
  "Артисты": Record<string, number>;
  "Исследователи": Record<string, number>;
  "Посредники": Record<string, number>;
}

export interface IUserQuiz {
  id: number;
  result: Record<string, Record<string, number>> | GallupResult |null;
  order: number;
  created: string;
  updated: string;
  quiz_type: string;
  is_active: boolean;
  is_deleted: boolean;
  start_time: string | null;
  end_time: string | null;
  is_ended: boolean;
  user: number;
  quiz: number;
}

export interface GallupResult {
  categories: {
    name: string;
    sub_categories: {
      name: string;
      score: number;
      description: string;
    }[]
  }[]
}

export interface IUserBinaryQuiz extends Omit<IUserQuiz, 'result'> {
  result: {
    name: string;
    score: number;
  }[]
}

export interface IQuizQuestion {
  id: number;
  order: number;
  created: string | null;
  updated: string | null;
  is_active: boolean;
  is_deleted: boolean;
  description: string;
  question_type: number;
  text_option_a: string;
  text_option_b: string;
  text_option_c: string;
  text_option_d: string;
  score_option_a: number;
  score_option_b: number;
  score_option_c: number;
  score_option_d: number;
  file_video: string | null;
  file_audio: string | null;
  file_image: string | null;
  sub_category: number;
}

export interface IUserQuestion {
  id: number;
  order: number;
  created: string;
  updated: string;
  question: IQuizQuestion;
  quiz_type: string;
  is_active: boolean;
  is_deleted: boolean;
  answer: string | null;
  score_for_answer: number;
  is_answered: boolean;
  user: number;
}

export interface IInfiniteScroll<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  total_count: number;
}

export interface IProducts {
  id: number;
  order: number;
  created: string;
  updated: string;
  is_active: boolean;
  is_deleted: boolean;
  name: string;
  description: string;
  price: number;
  file_image: string;
  quiz?: number[];
  course?: number[] | ICourse[]
  discounts?: IDiscount[]
  duration: number;
  start_date: string;
  end_date: string;
  is_open: boolean;
  is_subscription: boolean; 
  general_discount?: number;
  general_discount_enabled?: boolean; 
  is_free: boolean; 
}
