/* Custom styles for styled-components global */

import { createGlobalStyle } from 'styled-components';
import { Colors } from './theme';

export const GlobalStyle = createGlobalStyle`
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
