export interface IExamUploadResponse {
    id: number;
    order: number;
    created: string;
    updated: string;
    is_active: boolean;
    is_deleted: boolean;
    name: string;
    excel_file: string;
    date: string;
    class_teacher: number;
    course_tests:{
      id:number;
      course_name: string;
      max_score:string;
    }[]
  }
  
  interface FileItem {
    id: number;
    name: string;
    date: Date;
  }
  
  export interface IGradingPercentage {
    high: number;
    medium: number;
    low: number;
  }
  
  export interface IGradeVsAverage {
    name: string;
    average_score: number;
    average_goal: number;
    max_score: number;
    avg_score_percent: number;
    avg_goal_percent: number;
  }
  
  export interface IPercentGoalByCourse {
    offline_test_id: number;
    name: string;
    achieved_goals: number;
    total_users: number;
    percent_achieved: number;
  }
  
  export interface IExamResults {
    name: string;
    date: string;
    grading_percentage: IGradingPercentage;
    grade_vs_average: IGradeVsAverage[];
    percent_goal_by_course: IPercentGoalByCourse[];
    current_test_data?: ITestMetaData & { results: ITestResult[] }; // Новое свойство
    last_test_data?: ITestMetaData & { results: ITestResult[] };    // Новое свойство
  }
  
  
  export interface PieChartData {
    name: string;
    value: number;
    color: string;
  }
  
  export interface BarChartData {
    name: string;
    score: number;
    expected: number;
  }
  
  export interface IStudentProgressResponse {
    current_test_data: ITestMetaData & { results: ITestResult[] };
    last_test_data: ITestMetaData & { results: ITestResult[] };
  }
  
  export interface ITestMetaData {
    id: number;
    name: string;
    date: string;
  }
  
  export interface ITestResult {
    name: string;
    score: number;
    score_percent: number;
    max_score: number;
    expected_score: number;
  }
  
  export interface IEdugressGeneralTableData{
    user:{
      id:number;
      first_name: string;
      last_name:string;
    };
    courses: {
      name:string;
      score:number;
      max_score:number;
      coins:number;
      expected_score:number;
    }[]
    total_score: number;
    total_max_score: number;
    percentage:number;
  }
  
  export interface IUserResult {
      user: {
        first_name: string;
        last_name: string;
        id: number;
      };
      score: number;
      progress: number;
      expected_score: number;
    }
  
    export interface IStudentTestResult {
      name: string;
      score: number;
    }
  
    export interface IUserInfo {
      first_name: string;
      last_name: string;
    }
  
    export interface ITopStudent {
      user_id: number;
      user_info: IUserInfo;
      tests: IStudentTestResult[];
      total_score: number;
    }
  
    export interface IExamStudentResultResponse {
      top_students: {
        top: ITopStudent[];
        user_ranking: number;
      };
      user_data: IStudentTestResult[];
    }
  
  
    export interface IExamStudentResultResponse {
    top_students: {
      top: ITopStudent[];
      user_ranking: number;
    };
    user_data: IStudentTestResult[];
  }
  
  export interface ITopStudent {
    user_id: number;
    user_info: IUserInfo;
    tests: IStudentTestResult[];
    total_score: number;
  }
  
  export interface IStudentTestResult {
    name: string;
    score: number;
  }
  
  export interface IUserInfo {
    first_name: string;
    last_name: string;
  }
  
  export interface ProgressBarItem {
    name: string;
    offline_test_id: number;
    percent_achieved: number;
  }
  
  export interface MappedProgressBarData {
    name: string;
    offline_test_id: number;
    value: number;
    color: string;
  }
  
  export interface ICurator {
    id: number;
    first_name: string;
    last_name: string;
    branch?: number;
  }
  
  
  export interface RoadmapData {
    id: number;
    month: number;
    result: string | null;
    goal: string | null;
    order: number; 
    diagnostic_map?: string;
  }
  
  
  export interface UserRoadmapData {
    user: {
      id: number; // Добавляем id
      first_name: string;
      last_name: string;
      month: string;
    };
    roadmap: RoadmapData[];
  }
  
  export interface MilestoneProps {
    month: string;
    percentage: number;
    top: string;
    left: string;
    isResult: boolean;
    goal: string;
    result: string;
    bgColor?: string; 
  }
  
  
  