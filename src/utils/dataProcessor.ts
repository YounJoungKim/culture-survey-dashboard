import * as XLSX from 'xlsx';
import {
  SurveyRecord,
  OrganizationStats,
  CategoryScore,
  DashboardSummary,
  TeamStats,
  FILTER_COLUMNS,
  IGNORED_COLUMNS,
} from '../types/index';

/**
 * Excel 파일 파싱 및 데이터 추출
 */
export async function parseExcelFile(file: File): Promise<SurveyRecord[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        if (workbook.SheetNames.length === 0) {
          throw new Error('엑셀 파일에 시트가 없습니다.');
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
          throw new Error('시트를 읽을 수 없습니다.');
        }

        const records: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: ''
        });

        if (records.length < 2) {
          throw new Error('엑셀 파일에 데이터가 없습니다.');
        }

        const headerRow: string[] = records[0].map((col: any) => String(col).trim());
        const dataRows = records.slice(1);

        const normalizedRecords: SurveyRecord[] = dataRows
          .filter((row: any[]) => row.some((val) => val !== '' && val !== null))
          .map((row: any[]) => {
            const record: any = {};
            headerRow.forEach((col, idx) => {
              record[col] = row[idx] ?? '';
            });
            return record as SurveyRecord;
          });

        if (normalizedRecords.length === 0) {
          throw new Error('유효한 데이터 행이 없습니다.');
        }

        console.log('엑셀 헤더 컬럼:', headerRow);
        console.log('총 레코드 수:', normalizedRecords.length);

        resolve(normalizedRecords);
      } catch (error) {
        reject(new Error(`파일 파싱 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * 점수 컬럼 추출 (001~053 패턴, 숫자만 있는 컬럼)
 */
export function getScoreColumns(records: SurveyRecord[]): string[] {
  if (records.length === 0) return [];

  const firstRecord = records[0];
  const allColumns = Object.keys(firstRecord);

  // 무시할 컬럼과 필터 컬럼 제외
  const ignoredSet = new Set([...IGNORED_COLUMNS, ...FILTER_COLUMNS]);

  return allColumns.filter((col) => {
    if (ignoredSet.has(col as any)) return false;

    // 숫자로 시작하는 컬럼 (001_, 002_ 등)
    const match = col.match(/^(\d{3})/);
    if (!match) return false;

    const num = parseInt(match[1], 10);
    // 001~053은 점수 컬럼
    return num >= 1 && num <= 53;
  });
}

/**
 * 텍스트 컬럼 추출 (054, 055 패턴)
 */
export function getTextColumns(records: SurveyRecord[]): string[] {
  if (records.length === 0) return [];

  const firstRecord = records[0];
  const allColumns = Object.keys(firstRecord);

  return allColumns.filter((col) => {
    const match = col.match(/^(\d{3})/);
    if (!match) return false;

    const num = parseInt(match[1], 10);
    return num >= 54 && num <= 55;
  });
}

/**
 * 응답 완료 여부 확인 (상태 컬럼 기준)
 */
export function isCompleted(record: SurveyRecord): boolean {
  return record.상태 === '진단완료';
}

/**
 * 대시보드 요약 통계 계산
 */
export function calculateDashboardSummary(records: SurveyRecord[]): DashboardSummary {
  const totalCount = records.length;
  const completedCount = records.filter(isCompleted).length;
  const incompleteCount = totalCount - completedCount;
  const responseRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // 평균 만족도 계산 (응답 완료자만)
  const completedRecords = records.filter(isCompleted);
  const scoreColumns = getScoreColumns(records);

  let totalScore = 0;
  let scoreCount = 0;

  completedRecords.forEach((record) => {
    scoreColumns.forEach((col) => {
      const value = Number(record[col]);
      if (!isNaN(value) && value > 0) {
        totalScore += value;
        scoreCount++;
      }
    });
  });

  const avgSatisfaction = scoreCount > 0 ? Math.round((totalScore / scoreCount) * 10) / 10 : 0;

  return {
    totalCount,
    completedCount,
    incompleteCount,
    responseRate,
    avgSatisfaction,
  };
}

/**
 * 조직별 통계 계산
 */
export function calculateOrganizationStats(
  records: SurveyRecord[],
  groupBy: keyof SurveyRecord = '소속1'
): OrganizationStats[] {
  const statsMap = new Map<string, OrganizationStats>();

  records.forEach((record) => {
    const orgName = String(record[groupBy] || '미분류');

    if (!statsMap.has(orgName)) {
      statsMap.set(orgName, {
        name: orgName,
        total: 0,
        completed: 0,
        incomplete: 0,
        responseRate: 0,
      });
    }

    const stats = statsMap.get(orgName)!;
    stats.total++;

    if (isCompleted(record)) {
      stats.completed++;
    } else {
      stats.incomplete++;
    }
  });

  // 응답률 계산
  statsMap.forEach((stats) => {
    stats.responseRate = stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;
  });

  return Array.from(statsMap.values()).sort((a, b) => b.responseRate - a.responseRate);
}

/**
 * 팀별 현황 계산 (소속1 + 소속2 기준)
 */
export function calculateTeamStats(records: SurveyRecord[]): TeamStats[] {
  const teamMap = new Map<string, TeamStats>();

  records.forEach((record) => {
    const 소속1 = String(record.소속1 || '미분류');
    const 팀 = String(record.소속2 || '미분류');
    const key = `${소속1}||${팀}`;

    if (!teamMap.has(key)) {
      teamMap.set(key, {
        소속1,
        팀,
        총원: 0,
        수료: 0,
        미수료: 0,
        수료율: 0,
      });
    }

    const stats = teamMap.get(key)!;
    stats.총원++;

    if (isCompleted(record)) {
      stats.수료++;
    } else {
      stats.미수료++;
    }
  });

  // 수료율 계산
  teamMap.forEach((stats) => {
    stats.수료율 = stats.총원 > 0
      ? Math.round((stats.수료 / stats.총원) * 100)
      : 0;
  });

  return Array.from(teamMap.values()).sort((a, b) => a.수료율 - b.수료율);
}

/**
 * 필터 옵션 추출
 */
export function getFilterOptions(
  records: SurveyRecord[],
  column: string
): string[] {
  const options = new Set<string>();

  records.forEach((record) => {
    const value = record[column];
    if (value && String(value).trim()) {
      options.add(String(value).trim());
    }
  });

  return Array.from(options).sort();
}

/**
 * 데이터 필터링
 */
export function filterRecords(
  records: SurveyRecord[],
  filters: Partial<Record<string, string>>
): SurveyRecord[] {
  return records.filter((record) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === '전체') return true;
      return String(record[key]) === value;
    });
  });
}

/**
 * 응답 완료자만 필터링
 */
export function filterCompleteResponses(records: SurveyRecord[]): SurveyRecord[] {
  return records.filter(isCompleted);
}

/**
 * 카테고리별 점수 계산
 * 질문 번호를 기반으로 카테고리 분류
 */
export function calculateCategoryScores(records: SurveyRecord[]): Map<string, CategoryScore> {
  const categoryMap = new Map<string, CategoryScore>();
  const completedRecords = records.filter(isCompleted);

  if (completedRecords.length === 0) {
    return categoryMap;
  }

  const scoreColumns = getScoreColumns(records);

  // 질문을 카테고리로 그룹화 (질문 텍스트에서 카테고리 추출)
  const categoryGroups: Map<string, string[]> = new Map();

  scoreColumns.forEach((col) => {
    // 컬럼명에서 카테고리 추출 시도
    // 예: "001(a)_나는 우리 회사의..." -> 미션/비전
    // 예: "012_나의 상사는..." -> 리더십
    const questionNum = parseInt(col.match(/^(\d{3})/)?.[1] || '0', 10);

    let category = '기타';
    if (questionNum >= 1 && questionNum <= 3) category = '미션 인지';
    else if (questionNum >= 4 && questionNum <= 7) category = '비전 공유';
    else if (questionNum >= 8 && questionNum <= 11) category = '전략 이해';
    else if (questionNum >= 12 && questionNum <= 19) category = '리더십';
    else if (questionNum >= 20 && questionNum <= 30) category = '조직 운영';
    else if (questionNum >= 31 && questionNum <= 48) category = '조직 행동';
    else if (questionNum >= 49 && questionNum <= 53) category = '역량 개발';

    if (!categoryGroups.has(category)) {
      categoryGroups.set(category, []);
    }
    categoryGroups.get(category)!.push(col);
  });

  // 각 카테고리별 점수 계산
  categoryGroups.forEach((columns, categoryName) => {
    let totalScore = 0;
    let count = 0;

    completedRecords.forEach((record) => {
      columns.forEach((col) => {
        const value = Number(record[col]);
        if (!isNaN(value) && value > 0) {
          totalScore += value;
          count++;
        }
      });
    });

    const avgScore = count > 0 ? totalScore / count : 0;
    // 5점 척도를 100점 만점으로 변환
    const score100 = Math.round(avgScore * 20 * 10) / 10;

    categoryMap.set(categoryName, {
      categoryName,
      score: score100,
      importance: 50 + Math.random() * 50, // 임시 중요도
      satisfaction: score100,
      count,
      questionIds: columns,
    });
  });

  return categoryMap;
}

/**
 * 중요도-만족도 매트릭스 데이터 생성
 */
export function generateImportanceMatrix(
  categoryScores: Map<string, CategoryScore>
): Array<{
  x: number;
  y: number;
  label: string;
  value: number;
  category: string;
}> {
  const matrix: Array<{
    x: number;
    y: number;
    label: string;
    value: number;
    category: string;
  }> = [];

  categoryScores.forEach((score, key) => {
    matrix.push({
      x: score.satisfaction,
      y: score.importance,
      label: score.categoryName,
      value: score.score,
      category: key,
    });
  });

  return matrix;
}

/**
 * 사분면 기반 권장사항 생성
 */
export function getQuadrantRecommendation(
  importance: number,
  satisfaction: number
): {
  quadrant: string;
  color: string;
  recommendation: string;
} {
  const midPoint = 50;

  if (importance > midPoint && satisfaction < midPoint) {
    return {
      quadrant: '중점 개선 영역',
      color: '#E53935',
      recommendation:
        '중요도가 높으나 만족도가 낮습니다. 즉각적인 개선이 필요합니다.',
    };
  } else if (importance > midPoint && satisfaction > midPoint) {
    return {
      quadrant: '유지 강화 영역',
      color: '#43A047',
      recommendation: '중요도와 만족도가 모두 높습니다. 현 수준 유지하세요.',
    };
  } else if (importance < midPoint && satisfaction > midPoint) {
    return {
      quadrant: '점진적 개선 영역',
      color: '#FBC02D',
      recommendation:
        '만족도는 높지만 상대적 중요도가 낮습니다. 현상 유지하세요.',
    };
  } else {
    return {
      quadrant: '현상 유지 영역',
      color: '#90A4AE',
      recommendation:
        '중요도와 만족도가 모두 낮습니다. 우선순위를 재검토하세요.',
    };
  }
}

/**
 * 데이터 검증
 */
export function validateSurveyData(records: SurveyRecord[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (records.length === 0) {
    errors.push('응답 데이터가 없습니다.');
    return { isValid: false, errors, warnings };
  }

  const firstRecord = records[0];

  // 필수 컬럼 확인
  if (!('상태' in firstRecord)) {
    errors.push("'상태' 컬럼이 없습니다. LMS 엑셀 파일인지 확인하세요.");
  }

  if (!('소속1' in firstRecord)) {
    warnings.push("'소속1' 컬럼이 없습니다. 조직별 분석이 제한됩니다.");
  }

  // 점수 컬럼 확인
  const scoreColumns = getScoreColumns(records);
  if (scoreColumns.length === 0) {
    errors.push('점수 컬럼(001~053)을 찾을 수 없습니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
