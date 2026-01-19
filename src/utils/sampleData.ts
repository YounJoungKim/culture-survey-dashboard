import { SurveyRecord } from '../types/index';

/**
 * 테스트용 샘플 데이터 생성 (LMS 엑셀 형식)
 */
export function generateSampleData(count: number = 100): SurveyRecord[] {
  const 소속1Options = ['솔루션 큐셀 제조기술부문', '에너지솔루션부문', 'R&D센터', '경영지원본부'];
  const 소속2Options = ['기술본부', '생산본부', '품질본부', '연구소'];
  const 소속3Options = ['개발팀', '운영팀', '기획팀', '관리팀'];
  const 소속4Options = ['1그룹', '2그룹', '3그룹'];
  const 직책Options = ['팀원', '파트장', '팀장'];
  const 직군Options = ['일반직', '연구직', '기술직'];
  const 직급Options = ['사원급', '대리급', '과장급', '차장급', '부장급'];
  const 성별Options = ['남', '여'];
  const 상태Options: ('미진단' | '진단완료')[] = ['미진단', '진단완료'];

  const data: SurveyRecord[] = [];

  for (let i = 1; i <= count; i++) {
    const isCompleted = Math.random() > 0.3; // 70% 응답 완료
    const 상태 = isCompleted ? '진단완료' : '미진단';

    const record: SurveyRecord = {
      SEQ: String(1600000 + i),
      소속1: 소속1Options[Math.floor(Math.random() * 소속1Options.length)],
      소속2: 소속2Options[Math.floor(Math.random() * 소속2Options.length)],
      소속3: 소속3Options[Math.floor(Math.random() * 소속3Options.length)],
      소속4: 소속4Options[Math.floor(Math.random() * 소속4Options.length)],
      이름: `테스트${i}`,
      '아이디(E-mail)': `test${i}@example.com`,
      사번: `EMP${String(i).padStart(6, '0')}`,
      직책: 직책Options[Math.floor(Math.random() * 직책Options.length)],
      직군: 직군Options[Math.floor(Math.random() * 직군Options.length)],
      직급: 직급Options[Math.floor(Math.random() * 직급Options.length)],
      입사연도: String(2010 + Math.floor(Math.random() * 14)),
      성별: 성별Options[Math.floor(Math.random() * 성별Options.length)],
      근무지: 소속2Options[Math.floor(Math.random() * 소속2Options.length)],
      진단일시: isCompleted ? new Date().toISOString() : '-',
      상태,
    };

    // 응답 완료자만 점수 데이터 추가
    if (isCompleted) {
      // 001~053 질문에 대한 점수 (1~5점)
      for (let q = 1; q <= 53; q++) {
        const qNum = String(q).padStart(3, '0');
        record[`${qNum}_질문${q}`] = Math.floor(Math.random() * 5) + 1;
      }
      // 주관식 응답
      record['054_긍정적인 점'] = '좋은 팀 분위기';
      record['055_개선점'] = '의사소통 개선 필요';
    }

    data.push(record);
  }

  return data;
}

/**
 * LMS 엑셀 파일 컬럼 구조 예시
 */
export const LMS_EXCEL_COLUMNS = [
  'SEQ',
  '소속1', '소속2', '소속3', '소속4',
  '이름', '아이디(E-mail)', '사번',
  '직책', '직군', '직급', '입사연도', '성별', '근무지',
  '진단일시', '상태',
  // 001~053: 점수 질문
  // 054~055: 주관식 질문
];

/**
 * 샘플 데이터로 엑셀 생성 가능하도록 변환
 */
export function generateExcelTemplate() {
  return {
    SheetNames: ['데이터'],
    Sheets: {
      데이터: {
        '!ref': 'A1:BZ500',
        A1: { t: 's', v: 'SEQ' },
        B1: { t: 's', v: '소속1' },
        C1: { t: 's', v: '소속2' },
        D1: { t: 's', v: '소속3' },
        E1: { t: 's', v: '소속4' },
        F1: { t: 's', v: '이름' },
        G1: { t: 's', v: '아이디(E-mail)' },
        H1: { t: 's', v: '사번' },
        I1: { t: 's', v: '직책' },
        J1: { t: 's', v: '직군' },
        K1: { t: 's', v: '직급' },
        L1: { t: 's', v: '입사연도' },
        M1: { t: 's', v: '성별' },
        N1: { t: 's', v: '근무지' },
        O1: { t: 's', v: '진단일시' },
        P1: { t: 's', v: '상태' },
      },
    },
  };
}
