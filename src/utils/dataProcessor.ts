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
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const records: SurveyRecord[] = XLSX.utils.sheet_to_json(worksheet);

        if (records.length === 0) {
          throw new Error('엑셀 파일이 비어있습니다.');
        }

        resolve(records);
      } catch (error) {
        reject(error);
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
 * 카테고리별 점수 계산
 */
export function calculateCategoryScores(
  records: SurveyRecord[]
): Map<string, CategoryScore> {
  const categoryMap = new Map<string, CategoryScore>();

  // 일반적인 조직문화 진단 카테고리
  const categories = [
    '몰입도',
    '조직정렬',
    '커리어',
    '협업',
    '커뮤니케이션',
    '리더십',
    '직무만족도',
    '조직문화',
  ];

  categories.forEach((category) => {
    let totalScore = 0;
    let count = 0;

    records.forEach((record) => {
      // 레코드에서 해당 카테고리와 관련된 점수 추출
      const categoryKey = Object.keys(record).find(
        (key) =>
          key.includes(category) &&
          !isNaN(Number(record[key]))
      );

      if (categoryKey && record[categoryKey]) {
        const score = Number(record[categoryKey]);
        if (!isNaN(score)) {
          totalScore += score;
          count++;
        }
      }
    });

    const avgScore = count > 0 ? totalScore / count : 0;

    categoryMap.set(category, {
      categoryName: category,
      score: Math.round(avgScore * 10) / 10,
      importance: Math.random() * 100, // 실제 데이터로부터 계산 필요
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
