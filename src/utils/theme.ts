/**
 * 색상 팔레트 및 전역 스타일 상수
 * 참고 이미지 기반 보라색 테마
 */

export const Colors = {
  // 주요 보라색 컬러
  primary: '#7C3AED',
  primaryMuted: '#A78BFA',
  primaryLight: '#EDE9FE',
  primaryDark: '#5B21B6',

  // 상태 색상
  risk: '#EF4444',      // 빨강 (70% 미만)
  warning: '#F59E0B',   // 주황 (70-89%)
  good: '#10B981',      // 초록 (90% 이상)
  neutral: '#6B7280',

  // 알림 배경색
  alertBg: '#FEF2F2',   // 연한 분홍
  alertBorder: '#FECACA',

  // 텍스트 및 배경
  textMain: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  ui: '#E5E7EB',
  uiLight: '#F9FAFB',
  white: '#FFFFFF',
  black: '#000000',

  // 차트 색상
  chart: {
    purple: '#7C3AED',
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    red: '#EF4444',
    pink: '#EC4899',
    indigo: '#6366F1',
    teal: '#14B8A6',
  }
};

// 도넛 차트 색상 배열
export const CHART_COLORS = [
  '#7C3AED', // 보라
  '#3B82F6', // 파랑
  '#10B981', // 초록
  '#F59E0B', // 주황
  '#EF4444', // 빨강
  '#EC4899', // 핑크
  '#6366F1', // 인디고
  '#14B8A6', // 틸
];

export const GlobalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
  }

  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${Colors.uiLight};
    color: ${Colors.textMain};
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  input, select, textarea {
    font-family: inherit;
    font-size: 14px;
  }

  /* 스크롤바 커스텀 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${Colors.uiLight};
  }

  ::-webkit-scrollbar-thumb {
    background: ${Colors.ui};
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${Colors.textLight};
  }
`;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};

export const typography = {
  h1: {
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: '36px',
  },
  h2: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '28px',
  },
  h3: {
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '24px',
  },
  body1: {
    fontSize: '15px',
    fontWeight: 400,
    lineHeight: '24px',
  },
  body2: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
  },
  caption: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
  },
  number: {
    fontSize: '36px',
    fontWeight: 700,
    lineHeight: '44px',
  },
};

// 응답률에 따른 색상 반환
export function getResponseRateColor(rate: number): string {
  if (rate >= 90) return Colors.good;
  if (rate >= 70) return Colors.warning;
  return Colors.risk;
}

// 응답률 상태 텍스트
export function getResponseRateStatus(rate: number): string {
  if (rate >= 90) return '우수';
  if (rate >= 70) return '보통';
  return '미달';
}
