import * as XLSX from 'xlsx';
import {
  SurveyRecord,
  DashboardData,
  CategoryScore,
  OrganizationData,
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
        
        // 엑셀 헤더(첫 행) 기준으로 컬럼명 생성
        let records: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1, // 2차원 배열로 반환 (첫 행: 헤더)
          defval: ''
        });

        if (records.length < 2) {
          throw new Error('엑셀 파일에 데이터가 없습니다.');
        }

        const headerRow: string[] = records[0].map((col: any) => String(col).trim());
        const dataRows = records.slice(1);

        // 각 행을 SurveyRecord 객체로 변환 (헤더 기준)
        const normalizedRecords: SurveyRecord[] = dataRows
          .filter((row: any[]) => row.some((val) => val !== '' && val !== null))
          .map((row: any[]) => {
            const record: SurveyRecord = {};
            headerRow.forEach((col, idx) => {
              record[col] = row[idx] ?? '';
            });
            return record;
          });

        if (normalizedRecords.length === 0) {
          throw new Error('유효한 데이터 행이 없습니다.');
        }

        // 디버깅: 실제 컬럼명 출력
        console.log('엑셀 헤더 컬럼:', headerRow);

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
 * 조직별 응답률 계산
 */
export function calculateResponseRate(
  records: SurveyRecord[],
  totalInvited: number = 100
): number {
  return Math.round((records.length / totalInvited) * 100);
}

/**
 * 미응답 데이터 필터링 (동적 컬럼 감지)
 */
export function filterCompleteResponses(records: SurveyRecord[]): SurveyRecord[] {
  if (records.length === 0) return records;

  // 첫 번째 레코드에서 점수 필드 자동 감지 (숫자 값을 가진 필드들)
  const firstRecord = records[0];
  const scoreFields = Object.keys(firstRecord).filter((key) => {
    const value = firstRecord[key];
    // 점수처럼 보이는 필드: 숫자이고, 1-5 범위 또는 1-100 범위의 값
    return (
      !isNaN(Number(value)) && 
      Number(value) > 0 &&
      (Number(value) <= 5 || Number(value) <= 100)
    );
  });

  if (scoreFields.length === 0) {
    // 점수 필드가 없으면 모든 레코드를 반환
    console.warn('점수 필드를 찾을 수 없습니다. 모든 응답을 포함합니다.');
    return records;
  }

  return records.filter((record) => {
    // 감지된 모든 점수 필드가 유효한 숫자값인지 확인
    const hasCompleteResponses = scoreFields.every((field) => {
      const value = record[field];
      return (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !isNaN(Number(value)) &&
        Number(value) > 0
      );
    });

    return hasCompleteResponses;
  });
}

/**
 * 미응답 인원 통계
 */
export function getIncompleteResponseStats(records: SurveyRecord[]): {
  totalRecords: number;
  completeResponses: number;
  incompleteResponses: number;
  incompletionRate: number;
} {
  const completeRecords = filterCompleteResponses(records);
  const incomplete = records.length - completeRecords.length;

  return {
    totalRecords: records.length,
    completeResponses: completeRecords.length,
    incompleteResponses: incomplete,
    incompletionRate: records.length > 0 
      ? Math.round((incomplete / records.length) * 100)
      : 0,
  };
}

/**
 * 카테고리별 점수 계산 (동적 카테고리 감지)
 */
export function calculateCategoryScores(
  records: SurveyRecord[]
): Map<string, CategoryScore> {
  const categoryMap = new Map<string, CategoryScore>();

  if (records.length === 0) {
    return categoryMap;
  }

  // 첫 번째 레코드에서 점수 필드 추출
  const firstRecord = records[0];
  const scoreFields = Object.keys(firstRecord).filter((key) => {
    const value = firstRecord[key];
    return !isNaN(Number(value)) && Number(value) > 0;
  });

  // 동적 카테고리 추출 (점수 필드의 앞부분 추출: "몰입도_Q1" → "몰입도")
  const categories = new Set<string>();
  scoreFields.forEach((field) => {
    const categoryName = field.split('_')[0];
    if (categoryName && categoryName.length > 0) {
      categories.add(categoryName);
    }
  });

  // 카테고리가 없으면 기본값 사용
  if (categories.size === 0) {
    categories.add('전체');
  }

  categories.forEach((category) => {
    let totalScore = 0;
    let count = 0;

    records.forEach((record) => {
      // 해당 카테고리와 관련된 점수 필드 찾기
      const categoryFields = scoreFields.filter((key) =>
        key.startsWith(category)
      );

      categoryFields.forEach((field) => {
        const value = Number(record[field]);
        if (!isNaN(value) && value > 0) {
          totalScore += value;
          count++;
        }
      });
    });

    const avgScore = count > 0 ? totalScore / count : 0;

    categoryMap.set(String(category), {
      categoryName: String(category),
      score: Math.round(avgScore * 10) / 10,
      importance: Math.random() * 100,
      satisfaction: Math.round(avgScore * 10) / 10,
      count,
    });
  });

  return categoryMap;
}

/**
 * 조직별 데이터 분석
 */
export function analyzeByOrganization(
  records: SurveyRecord[]
): Map<string, OrganizationData> {
  const orgMap = new Map<string, OrganizationData>();

  records.forEach((record) => {
    const orgName = record.소속1 || '전체';

    if (!orgMap.has(orgName)) {
      orgMap.set(orgName, {
        name: orgName,
        respondents: 0,
        responseRate: 0,
        categories: [],
      });
    }

    const orgData = orgMap.get(orgName)!;
    orgData.respondents++;
  });

  // 응답률 계산
  const totalRespondents = records.length;
  orgMap.forEach((orgData) => {
    orgData.responseRate = Math.round(
      (orgData.respondents / totalRespondents) * 100
    );
  });

  return orgMap;
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
      x: score.satisfaction || Math.random() * 100,
      y: score.importance || Math.random() * 100,
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
 * 필터된 데이터 추출
 */
export function filterDataByOrganization(
  records: SurveyRecord[],
  organization: 'all' | 'dept1' | 'dept2' | 'dept3'
): SurveyRecord[] {
  if (organization === 'all') {
    return records;
  }

  const deptMap = {
    dept1: (r: SurveyRecord) => r.소속1,
    dept2: (r: SurveyRecord) => r.소속2,
    dept3: (r: SurveyRecord) => r.소속3,
  };

  return records.filter((r) => deptMap[organization]?.(r));
}

/**
 * 대시보드 데이터 생성
 */
export function generateDashboardData(
  records: SurveyRecord[],
  totalInvited: number = 100
): DashboardData {
  return {
    uploadDate: new Date(),
    totalRespondents: records.length,
    totalInvited,
    responseRate: calculateResponseRate(records, totalInvited),
    organizations: analyzeByOrganization(records),
    categoryScores: Array.from(calculateCategoryScores(records).values()),
    questionScores: [],
  };
}

/**
 * 데이터 검증
 */
export function validateSurveyData(records: SurveyRecord[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (records.length === 0) {
    errors.push('응답 데이터가 없습니다.');
  }

  if (records.length > 0) {
    const requiredFields = ['소속1'];
    const firstRecord = records[0];

    requiredFields.forEach((field) => {
      if (!(field in firstRecord)) {
        errors.push(`필수 필드 '${field}'가 없습니다.`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
