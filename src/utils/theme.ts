/**
 * 색상 팔레트 및 전역 스타일 상수
 */

export const Colors = {
  // 주요 오렌지 컬러
  primary: '#FF8A00',
  primaryMuted: '#FFB55A',
  primaryLight: '#FFF4E5',

  // 상태 색상
  risk: '#E53935',
  warning: '#FBC02D',
  good: '#43A047',
  neutral: '#90A4AE',

  // 텍스트 및 배경
  textMain: '#4A4A4A',
  textSecondary: '#757575',
  textLight: '#BDBDBD',
  ui: '#E6E6E6',
  uiLight: '#F5F5F5',
  white: '#FFFFFF',
  black: '#000000',
};

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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
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
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  input, select, textarea {
    font-family: inherit;
    font-size: 14px;
  }

  /* 스크롤바 커스텀 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${Colors.uiLight};
  }

  ::-webkit-scrollbar-thumb {
    background: ${Colors.ui};
    border-radius: 4px;
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
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
};

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};

export const typography = {
  h1: {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: '40px',
  },
  h2: {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: '32px',
  },
  h3: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '28px',
  },
  body1: {
    fontSize: '16px',
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
};
