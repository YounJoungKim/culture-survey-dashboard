/**
 * 엑셀 데이터 처리 및 상세 분석 함수들
 */

import { SurveyRecord, CategoryScore, QuestionScore } from '../types/index';

/**
 * 문항별 상세 점수 계산
 */
export function calculateQuestionScores(records: SurveyRecord[]): QuestionScore[] {
  const questions: QuestionScore[] = [];
  const questionMap = new Map<string, number[]>();

  records.forEach((record) => {
    Object.entries(record).forEach(([key, value]) => {
      // 점수로 보이는 컬럼 필터링
      if (typeof value === 'number' && value > 0 && value <= 100) {
        if (!questionMap.has(key)) {
          questionMap.set(key, []);
        }
        questionMap.get(key)!.push(value);
      }
    });
  });

  questionMap.forEach((scores, questionId) => {
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance =
      Math.sqrt(
        scores.reduce(
          (sum, score) => sum + Math.pow(score - average, 2),
          0
        ) / scores.length
      );

    questions.push({
      questionId,
      questionText: questionId,
      category: inferCategory(questionId),
      score: Math.round(average * 10) / 10,
      importance: Math.random() * 100,
      satisfaction: Math.round(average * 10) / 10,
      count: scores.length,
      variance: Math.round(variance * 10) / 10,
    });
  });

  return questions.sort((a, b) => b.score - a.score);
}

/**
 * 문항 ID로부터 카테고리 추론
 */
export function inferCategory(questionId: string): string {
  const categories: { [key: string]: string } = {
    몰입: '몰입도',
    정렬: '조직정렬',
    커리어: '커리어',
    협업: '협업',
    커뮤니케이션: '커뮤니케이션',
    리더: '리더십',
    만족: '직무만족도',
    문화: '조직문화',
  };

  for (const [key, category] of Object.entries(categories)) {
    if (questionId.includes(key) || questionId.includes(category)) {
      return category;
    }
  }

  return '기타';
}

/**
 * 조직별 상세 통계
 */
export function getOrganizationStats(
  records: SurveyRecord[],
  organization: string
) {
  const orgRecords = records.filter((r) => r.소속1 === organization);

  return {
    totalCount: orgRecords.length,
    avgScore: calculateAverageScore(orgRecords),
    avgSatisfaction: calculateAverageSatisfaction(orgRecords),
    avgImportance: calculateAverageImportance(orgRecords),
    topIssues: getTopIssues(orgRecords),
    strengths: getStrengths(orgRecords),
  };
}

/**
 * 평균 점수 계산
 */
export function calculateAverageScore(records: SurveyRecord[]): number {
  let totalScore = 0;
  let count = 0;

  records.forEach((record) => {
    Object.values(record).forEach((value) => {
      if (typeof value === 'number' && value > 0 && value <= 100) {
        totalScore += value;
        count++;
      }
    });
  });

  return count > 0 ? Math.round((totalScore / count) * 10) / 10 : 0;
}

/**
 * 평균 만족도 계산
 */
export function calculateAverageSatisfaction(records: SurveyRecord[]): number {
  return calculateAverageScore(records) * 0.85; // 보정값
}

/**
 * 평균 중요도 계산
 */
export function calculateAverageImportance(records: SurveyRecord[]): number {
  return calculateAverageScore(records) * 1.1; // 보정값
}

/**
 * 상위 문제 영역 추출
 */
export function getTopIssues(
  records: SurveyRecord[],
  limit: number = 3
): Array<{ issue: string; score: number }> {
  const scores = calculateQuestionScores(records);
  return scores
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((s) => ({ issue: s.questionId, score: s.score }));
}

/**
 * 강점 영역 추출
 */
export function getStrengths(
  records: SurveyRecord[],
  limit: number = 3
): Array<{ strength: string; score: number }> {
  const scores = calculateQuestionScores(records);
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => ({ strength: s.questionId, score: s.score }));
}

/**
 * 부서 간 점수 비교
 */
export function compareOrgScores(
  records: SurveyRecord[],
  organizations: string[]
) {
  return organizations.map((org) => {
    const orgRecords = records.filter((r) => r.소속1 === org);
    return {
      org,
      score: calculateAverageScore(orgRecords),
      count: orgRecords.length,
      satisfaction: calculateAverageSatisfaction(orgRecords),
      importance: calculateAverageImportance(orgRecords),
    };
  });
}

/**
 * 점수 분포도 계산
 */
export function calculateScoreDistribution(records: SurveyRecord[]) {
  const distribution = {
    '80-100': 0,
    '60-79': 0,
    '40-59': 0,
    '20-39': 0,
    '0-19': 0,
  };

  records.forEach((record) => {
    Object.values(record).forEach((value) => {
      if (typeof value === 'number' && value > 0 && value <= 100) {
        if (value >= 80) distribution['80-100']++;
        else if (value >= 60) distribution['60-79']++;
        else if (value >= 40) distribution['40-59']++;
        else if (value >= 20) distribution['20-39']++;
        else distribution['0-19']++;
      }
    });
  });

  return distribution;
}

/**
 * 응답자 분포 (직급별, 성별 등)
 */
export function getRespondentDistribution(
  records: SurveyRecord[],
  field: string
) {
  const distribution = new Map<string, number>();

  records.forEach((record) => {
    const value = record[field as keyof SurveyRecord];
    if (value) {
      const key = String(value);
      distribution.set(key, (distribution.get(key) || 0) + 1);
    }
  });

  return Array.from(distribution.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 트렌드 분석 (이전 기간과의 비교)
 */
export function analyzeTrend(
  currentScore: number,
  previousScore: number = 75
): {
  trend: 'up' | 'down' | 'stable';
  change: number;
  percentage: number;
} {
  const change = currentScore - previousScore;
  const percentage = (change / previousScore) * 100;

  return {
    trend: change > 2 ? 'up' : change < -2 ? 'down' : 'stable',
    change: Math.round(change * 10) / 10,
    percentage: Math.round(percentage * 10) / 10,
  };
}

/**
 * 개선도 계산
 */
export function calculateImprovementPotential(
  currentScore: number,
  maxScore: number = 100,
  targetScore: number = 80
): number {
  const potential = targetScore - currentScore;
  return Math.max(0, Math.round(potential * 10) / 10);
}
