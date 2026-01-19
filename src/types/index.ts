/**
 * 조직문화 진단 대시보드 - 타입 정의
 */

export interface SurveyRecord {
  응답자ID?: string;
  소속1?: string;
  소속2?: string;
  소속3?: string;
  직급?: string;
  성별?: string;
  근속년수?: number;
  [key: string]: string | number | undefined;
}

export interface OrganizationData {
  name: string;
  respondents: number;
  responseRate: number;
  categories: CategoryScore[];
}

export interface CategoryScore {
  categoryName: string;
  score: number;
  importance: number;
  satisfaction: number;
  count: number;
}

export interface DashboardData {
  uploadDate: Date;
  totalRespondents: number;
  totalInvited: number;
  responseRate: number;
  organizations: Map<string, OrganizationData>;
  categoryScores: CategoryScore[];
  questionScores: QuestionScore[];
}

export interface QuestionScore {
  questionId: string;
  questionText: string;
  category: string;
  score: number;
  importance: number;
  satisfaction: number;
  count: number;
  variance: number;
}

export interface ImportanceMatrix {
  x: number; // 만족도
  y: number; // 중요도
  label: string;
  value: number;
  category: string;
  color: string;
}

export interface Quadrant {
  name: string;
  xRange: [number, number];
  yRange: [number, number];
  color: string;
  description: string;
}

export interface DragItem {
  type: 'category' | 'question';
  id: string;
  label: string;
}

export interface FilterState {
  organization: 'all' | 'dept1' | 'dept2' | 'dept3';
  selectedElements: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface AnalysisResult {
  selectedElement: string;
  satisfaction: number;
  importance: number;
  quadrant: string;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
  departmentComparison: {
    [key: string]: number;
  };
}
