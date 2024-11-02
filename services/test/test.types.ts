import { TestData } from "../course.types";
export interface TestWrapper {
  count: number;
  next: string | null;
  previous: string | null;
  // user_test: number;
  results: ITestQuestions[];
}

export interface QuestionWrapper {
  count: number;
  next: string | null;
  previous: string | null;
  // user_test: number;
  results: TestQuestion[];
}

export interface BaseQuestion {
  order: number;
  id?: number;
  description: {
    text: string | null;
    column1?: string | null;
    column2?: string | null;
    paragraph?: string | null;
    mathText?: string | null
  };
  question_type: QuestionType;
  score: number;
  isActive?: boolean;
  isDeleted?: boolean;
  check_needed?: boolean;
  test?: number | null;
  video?: string;
  image?: string;
  is_math?: boolean
}

export enum QuestionType {
  SingleSelect = 0,
  MultipleSelect = 1,
  Match = 2,
  ShortOpen = 3,
  DragDrop = 4,
  OpenParagraph = 5,
  QuantitativeCharacteristics = 6
}

export type MatchAnswers = { [key: string]: string };
export type DragDropAnswers = { [category: string]: string[] };

export interface SingleSelectQuestion extends BaseQuestion {
  question_type: QuestionType.SingleSelect;
  options: {
    options: { text: string; img?: string }[];
  };
  answer: { answer: { text: string; img?: string } } | null;
}

export interface MultipleSelectQuestion extends BaseQuestion {
  question_type: QuestionType.MultipleSelect;
  options: { options: { text: string; img?: string }[] }; 
  answer: { answer: { text: string; img?: string }[] } | null;
}


export interface MatchQuestion extends BaseQuestion {
  question_type: QuestionType.Match;
  options: {
    left: { [index: string]: { text: string; img: string } }[];
    right: { [index: string]: { text: string; img: string } }[];
  };
  answer: MatchAnswers | {}; // User's matching answers
}

export interface ShortOpenQuestion extends BaseQuestion {
  question_type: QuestionType.ShortOpen;
  answer: { answer: string } | null; // User's textual answer
}

export interface DragDropQuestion extends BaseQuestion {
  question_type: QuestionType.DragDrop;
  options: {
    categories: string[],
    options: { [index: string]: { text: string; img: string } }[];
  };
  answer: DragDropAnswers | null; // User's categorized items
}

export interface OpenParagraphQuestion extends BaseQuestion {
  question_type: QuestionType.OpenParagraph;
  answer: { answer: string } | null; // User's long textual answer
}

export interface QuantitativeCharacteristicsQuestion extends BaseQuestion {
  question_type: QuestionType.QuantitativeCharacteristics;
  options: { options: string[] };  // Usually "A", "B", "C", "D"
  answer: { answer: string } | null; // User's selected option
}

export type TestQuestion =
  SingleSelectQuestion
  | MultipleSelectQuestion
  | MatchQuestion
  | ShortOpenQuestion
  | DragDropQuestion
  | OpenParagraphQuestion
  | QuantitativeCharacteristicsQuestion;

export interface ITestQuestions {
  correct_answer: {};
  checked: boolean | null;
  course: number | null;
  flag: FlagType;
  id: number;
  is_answered: boolean | null;
  order: number;
  score_for_answer: string | null;
  test_question: number;
  test_question_data: TestQuestion;
  user: number;
  user_answer: UserAnswer;
  user_test: number;
  video?: string;
  image?: string;
  test?: number;
  is_math?: boolean
}

export type UserAnswer =
  { answer: { text: string; img?: string } }  // img теперь необязательный
  | { answer: { text: string; img?: string }[] }
  | { answer: string }  // для SingleSelect, ShortOpen, OpenParagraph, QuantitativeCharacteristics
  | { answer: string[] }  // для MultipleSelect
  | { [key: string]: string }  // для Match
  | { [key: string]: string[] };  // для DragDrop



  export interface IUserTestResults {
    correct_count: number | string; // Добавляем поддержку string | number
    ended_time: string;
    id: number;
    is_ended: boolean;
    order: number;
    score: string | number; // Поддержка как строки, так и числа
    test_data: TestData;
    user_data: {
      id: number;
      full_name: string;
    };
    user_answers: UserTestResultQuestions[];
    total?: number;
    amount?: number;
    completion_percentage?: number;
  }
  
  
  

export enum FlagType {
  UNTAGGED = 0,
  CORRECT = 1,
  SEMI_CORRECT = 2,
  INCORRECT = 3,
}

export interface UserTestResultQuestions {
  id: number;
  correct_answer: UserAnswer;
  test_question_data: TestQuestion; // Use TestQuestion to ensure type coverage
  order: number;
  user_answer: UserAnswer;
  is_answered: boolean | null;
  score_for_answer: string;
  checked: boolean;
  flag: FlagType;
  user: number;
  user_test: number;
  test_question: number;
  course: number | null;
}
export { TestData };

