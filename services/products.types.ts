import { IUserCourse } from "./course.types";

export interface IInfiniteScrollOrders<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface IOrder {
  amount: number;
  order_url: string;
  receipt_url: string;
  status_label: string;
  created: string;
  updated: string;
  product: IProducts;
  user:{
    first_name: string;
    last_name: string;
    id:number;
    username: string;
  }
  subscription:{
    next_payment: string;
    subscription_active: boolean
    user_courses: string[]
  }
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
  quiz: number[];
  is_subscription: boolean
}

export interface IProductById {
  id: number;
  name: string;
  user_courses: IUserCourse[]
  description: string;
  start_date: string;
  end_date: string;
  duration: number;
  is_open: boolean;
  user_subscription?:{
    amount: number;
    next_payment: string;
  }
}

export interface IDiscount {
  id:number;
  months: number;
  percent:number;
}