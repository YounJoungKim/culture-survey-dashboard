import React, { useState } from 'react';
import styled from 'styled-components';
import { GlobalStyles, Colors } from './utils/theme';
import FileUpload from './components/FileUpload';
import Dashboard from './pages/Dashboard';
import { SurveyRecord } from './types/index';

const AppContainer = styled.div`
  ${GlobalStyles}
`;

const ErrorContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${Colors.risk};
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(229, 57, 53, 0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const App: React.FC = () => {
  const [surveyData, setSurveyData] = useState<SurveyRecord[] | null>(null);
  const [error, setError] = useState<string>('');

  const handleUpload = (records: SurveyRecord[]) => {
    setSurveyData(records);
    setError('');
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
    setTimeout(() => setError(''), 5000);
  };

  const handleReset = () => {
    setSurveyData(null);
    setError('');
  };

  return (
    <AppContainer>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>

      {!surveyData ? (
        <FileUpload onUpload={handleUpload} onError={handleError} />
      ) : (
        <Dashboard data={surveyData} onReset={handleReset} />
      )}

      {error && <ErrorContainer>{error}</ErrorContainer>}
    </AppContainer>
  );
};

export default App;
