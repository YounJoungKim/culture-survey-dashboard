import { SurveyRecord } from '../types/index';

/**
 * 테스트용 샘플 데이터 생성
 */
export function generateSampleData(count: number = 100): SurveyRecord[] {
  const departments = ['마케팅팀', ' HR팀', '개발팀', '디자인팀'];
  const subdepts = ['서울', '부산', '대구'];
  const positions = ['사원', '대리', '과장', '부장'];
  const genders = ['남', '여'];

  const data: SurveyRecord[] = [];

  for (let i = 1; i <= count; i++) {
    const record: SurveyRecord = {
      응답자ID: `RES_${String(i).padStart(5, '0')}`,
      소속1: departments[Math.floor(Math.random() * departments.length)],
      소속2: subdepts[Math.floor(Math.random() * subdepts.length)],
      소속3: `${Math.floor(Math.random() * 5) + 1}조`,
      직급: positions[Math.floor(Math.random() * positions.length)],
      성별: genders[Math.floor(Math.random() * genders.length)],
      근속년수: Math.floor(Math.random() * 15) + 1,

      // 조직문화 영역별 점수 (1-5점)
      '몰입도_Q1': Math.floor(Math.random() * 5) + 1,
      '몰입도_Q2': Math.floor(Math.random() * 5) + 1,
      '조직정렬_Q1': Math.floor(Math.random() * 5) + 1,
      '조직정렬_Q2': Math.floor(Math.random() * 5) + 1,
      '커리어_Q1': Math.floor(Math.random() * 5) + 1,
      '커리어_Q2': Math.floor(Math.random() * 5) + 1,
      '협업_Q1': Math.floor(Math.random() * 5) + 1,
      '협업_Q2': Math.floor(Math.random() * 5) + 1,
      '커뮤니케이션_Q1': Math.floor(Math.random() * 5) + 1,
      '커뮤니케이션_Q2': Math.floor(Math.random() * 5) + 1,
      '리더십_Q1': Math.floor(Math.random() * 5) + 1,
      '리더십_Q2': Math.floor(Math.random() * 5) + 1,
      '직무만족도_Q1': Math.floor(Math.random() * 5) + 1,
      '직무만족도_Q2': Math.floor(Math.random() * 5) + 1,
      '조직문화_Q1': Math.floor(Math.random() * 5) + 1,
      '조직문화_Q2': Math.floor(Math.random() * 5) + 1,

      // 중요도 점수 (1-5점)
      '중요도_몰입': Math.floor(Math.random() * 5) + 1,
      '중요도_정렬': Math.floor(Math.random() * 5) + 1,
      '중요도_커리어': Math.floor(Math.random() * 5) + 1,
      '중요도_협업': Math.floor(Math.random() * 5) + 1,
      '중요도_커뮤니케이션': Math.floor(Math.random() * 5) + 1,
      '중요도_리더십': Math.floor(Math.random() * 5) + 1,
    };

    data.push(record);
  }

  return data;
}

/**
 * 실제 데이터 형식 예시
 */
export const SAMPLE_DATA_TEMPLATE = {
  columns: [
    '응답자ID',
    '소속1',
    '소속2',
    '소속3',
    '직급',
    '성별',
    '근속년수',
    '몰입도_Q1',
    '몰입도_Q2',
    '조직정렬_Q1',
    '조직정렬_Q2',
    '커리어_Q1',
    '커리어_Q2',
    '협업_Q1',
    '협업_Q2',
    '커뮤니케이션_Q1',
    '커뮤니케이션_Q2',
    '리더십_Q1',
    '리더십_Q2',
    '직무만족도_Q1',
    '직무만족도_Q2',
    '조직문화_Q1',
    '조직문화_Q2',
    '중요도_몰입',
    '중요도_정렬',
    '중요도_커리어',
    '중요도_협업',
    '중요도_커뮤니케이션',
    '중요도_리더십',
  ],
  example: {
    응답자ID: 'RES_00001',
    소속1: '마케팅팀',
    소속2: '서울',
    소속3: '1조',
    직급: '대리',
    성별: '남',
    근속년수: 3,
    '몰입도_Q1': 4,
    '몰입도_Q2': 3,
    '조직정렬_Q1': 5,
    '조직정렬_Q2': 4,
    '커리어_Q1': 2,
    '커리어_Q2': 3,
    '협업_Q1': 4,
    '협업_Q2': 4,
    '커뮤니케이션_Q1': 3,
    '커뮤니케이션_Q2': 3,
    '리더십_Q1': 4,
    '리더십_Q2': 4,
    '직무만족도_Q1': 4,
    '직무만족도_Q2': 4,
    '조직문화_Q1': 3,
    '조직문화_Q2': 3,
    '중요도_몰입': 5,
    '중요도_정렬': 4,
    '중요도_커리어': 4,
    '중요도_협업': 5,
    '중요도_커뮤니케이션': 3,
    '중요도_리더십': 4,
  },
};

/**
 * CSV 형식으로 샘플 데이터 내보내기
 */
export function exportSampleDataAsCSV(): string {
  const template = SAMPLE_DATA_TEMPLATE;
  const headers = template.columns.join(',');
  const example = headers.split(',').map(col => template.example[col as keyof typeof template.example] || '');

  return `${headers}\n${example.join(',')}`;
}

/**
 * 샘플 데이터로 엑셀 생성 가능하도록 변환
 */
export function generateExcelTemplate() {
  return {
    SheetNames: ['데이터'],
    Sheets: {
      데이터: {
        '!ref': 'A1:Z100',
        A1: { t: 's', v: '응답자ID' },
        B1: { t: 's', v: '소속1' },
        C1: { t: 's', v: '소속2' },
        D1: { t: 's', v: '소속3' },
        // ... 더 많은 헤더
      },
    },
  };
}
