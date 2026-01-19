/**
 * 조직문화 진단 대시보드 - 타입 정의
 * LMS 엑셀 파일 구조 기반
 */

// 엑셀에서 읽어온 원본 레코드
export interface SurveyRecord {
  SEQ: string; // 개인식별코드 (텍스트)
  소속1?: string;
  소속2?: string;
  소속3?: string;
  소속4?: string;
  이름?: string;
  '아이디(E-mail)'?: string;
  사번?: string;
  직책?: string;
  직군?: string;
  직급?: string;
  입사연도?: string;
  성별?: string;
  근무지?: string;
  진단일시?: string;
  상태: '미진단' | '진단완료' | string;
  [key: string]: string | number | undefined;
}

// 필터 구분자 컬럼들
export const FILTER_COLUMNS = [
  '소속1', '소속2', '소속3', '소속4',
  '직책', '직군', '직급', '입사연도', '성별', '근무지'
] as const;

// 무시할 컬럼들
export const IGNORED_COLUMNS = [
  'SEQ', '이름', '아이디(E-mail)', '사번', '진단일시', '상태'
] as const;

// 텍스트 분석용 컬럼 (054, 055)
export const TEXT_COLUMNS_PATTERN = /^05[45]/;

// 점수 컬럼 패턴 (001~053)
export const SCORE_COLUMNS_PATTERN = /^0[0-4][0-9]|^05[0-3]/;

export interface OrganizationStats {
  name: string;
  total: number; // 전체 인원
  completed: number; // 응답 완료
  incomplete: number; // 미응답
  responseRate: number; // 응답률 (%)
}

export interface CategoryScore {
  categoryName: string;
  score: number;
  importance: number;
  satisfaction: number;
  count: number;
  questionIds: string[];
}

export interface QuestionScore {
  questionId: string;
  questionText: string;
  category: string;
  score: number;
  count: number;
  variance: number;
}

export interface DashboardSummary {
  totalCount: number; // 전체 인원
  completedCount: number; // 응답 완료 인원
  incompleteCount: number; // 미응답 인원
  responseRate: number; // 전체 응답률
  avgSatisfaction: number; // 평균 만족도
}

export interface TeamStats {
  소속1: string;
  팀: string;
  총원: number;
  수료: number;
  미수료: number;
  수료율: number;
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

export interface FilterState {
  소속1?: string;
  소속2?: string;
  소속3?: string;
  소속4?: string;
  직책?: string;
  직군?: string;
  직급?: string;
  성별?: string;
  입사연도?: string;
  근무지?: string;
}

export interface AnalysisResult {
  element: string;
  satisfaction: number;
  importance: number;
  quadrant: string;
  recommendation: string;
  departmentComparison: {
    name: string;
    score: number;
  }[];
  variance: number;
}
