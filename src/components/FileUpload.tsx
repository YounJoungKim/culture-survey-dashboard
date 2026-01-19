import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Colors, spacing, borderRadius } from '../utils/theme';
import { parseExcelFile, validateSurveyData } from '../utils/dataProcessor';
import { SurveyRecord } from '../types/index';

interface FileUploadProps {
  onUpload: (records: SurveyRecord[]) => void;
  onError: (error: string) => void;
}

const Container = styled.div`
  min-height: 100vh;
  background-color: ${Colors.uiLight};
  padding: ${spacing.xl};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  margin-bottom: ${spacing.xxl};
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: ${Colors.primaryLight};
  border-radius: ${borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const HeaderText = styled.div``;

const HeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${Colors.textMain};
  margin: 0;
`;

const HeaderSubtitle = styled.p`
  font-size: 14px;
  color: ${Colors.textSecondary};
  margin: 4px 0 0 0;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding-top: ${spacing.xxl};
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${Colors.textMain};
  text-align: center;
  margin-bottom: ${spacing.sm};
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: ${Colors.textSecondary};
  text-align: center;
  margin-bottom: ${spacing.xl};
`;

const DropZone = styled.div<{ isDragActive: boolean }>`
  background: ${Colors.white};
  border: 2px dashed ${(props) => (props.isDragActive ? Colors.primary : Colors.ui)};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xxl} ${spacing.xl};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    border-color: ${Colors.primary};
    background-color: ${Colors.primaryLight};
  }
`;

const UploadIconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background-color: ${Colors.primaryLight};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${spacing.lg};
`;

const UploadIcon = styled.div`
  color: ${Colors.primary};
  font-size: 28px;
`;

const DropText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${Colors.textMain};
  margin-bottom: ${spacing.xs};
`;

const DropHint = styled.p`
  font-size: 14px;
  color: ${Colors.textSecondary};
  margin-bottom: ${spacing.lg};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${spacing.sm};
  margin-top: ${spacing.md};
`;

const Tag = styled.span`
  background-color: ${Colors.uiLight};
  color: ${Colors.textSecondary};
  padding: 6px 12px;
  border-radius: ${borderRadius.full};
  font-size: 13px;
  border: 1px solid ${Colors.ui};
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${spacing.xl} 0;
  color: ${Colors.textSecondary};
  font-size: 14px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${Colors.ui};
  }

  &::before {
    margin-right: ${spacing.md};
  }

  &::after {
    margin-left: ${spacing.md};
  }
`;

const SampleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  padding: ${spacing.md} ${spacing.lg};
  background-color: ${Colors.white};
  border: 1px solid ${Colors.ui};
  border-radius: ${borderRadius.md};
  color: ${Colors.textMain};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${Colors.uiLight};
    border-color: ${Colors.primary};
    color: ${Colors.primary};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ErrorMessage = styled.div`
  background-color: ${Colors.alertBg};
  border: 1px solid ${Colors.alertBorder};
  padding: ${spacing.md};
  margin-top: ${spacing.lg};
  border-radius: ${borderRadius.md};
  color: ${Colors.risk};
  font-size: 14px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background-color: #ECFDF5;
  border: 1px solid #A7F3D0;
  padding: ${spacing.md};
  margin-top: ${spacing.lg};
  border-radius: ${borderRadius.md};
  color: ${Colors.good};
  font-size: 14px;
  text-align: center;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${Colors.ui};
  border-top-color: ${Colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, onError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError('');
    setSuccess('');

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Excel 파일(.xlsx, .xls)만 업로드 가능합니다.');
      onError('Excel 파일(.xlsx, .xls)만 업로드 가능합니다.');
      return;
    }

    setIsLoading(true);

    try {
      const records = await parseExcelFile(file);
      const validation = validateSurveyData(records);

      if (!validation.isValid) {
        const errorMsg = validation.errors.join(', ');
        setError(errorMsg);
        onError(errorMsg);
        return;
      }

      if (validation.warnings.length > 0) {
        console.warn('데이터 경고:', validation.warnings);
      }

      setSuccess(`${records.length}명의 데이터를 성공적으로 로드했습니다.`);
      setTimeout(() => {
        onUpload(records);
      }, 500);
    } catch (err: any) {
      const errorMsg = err.message || '파일 처리 중 오류가 발생했습니다.';
      setError(errorMsg);
      onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSampleData = () => {
    // 샘플 데이터로 시작하기 (추후 구현)
    alert('샘플 데이터 기능은 준비 중입니다.');
  };

  return (
    <Container>
      <Header>
        <LogoIcon>
          <span role="img" aria-label="chart">&#128202;</span>
        </LogoIcon>
        <HeaderText>
          <HeaderTitle>조직문화 진단</HeaderTitle>
          <HeaderSubtitle>진단 현황 대시보드</HeaderSubtitle>
        </HeaderText>
      </Header>

      <Content>
        <Title>진단 데이터를 업로드해주세요</Title>
        <Subtitle>
          Excel 파일을 업로드하면 자동으로 시각화된 대시보드를 확인할 수 있습니다.
        </Subtitle>

        <DropZone
          isDragActive={isDragActive}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <UploadIconWrapper>
            <UploadIcon>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </UploadIcon>
          </UploadIconWrapper>
          <DropText>Excel 파일을 드래그하거나 클릭하여 업로드</DropText>
          <DropHint>.xlsx, .xls 파일 지원</DropHint>
          <TagsContainer>
            <Tag>소속1~4</Tag>
            <Tag>직책</Tag>
            <Tag>직급</Tag>
            <Tag>성별</Tag>
            <Tag>상태</Tag>
            <Tag>+4개</Tag>
          </TagsContainer>
        </DropZone>

        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          disabled={isLoading}
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Divider>또는</Divider>

        <SampleButton onClick={handleSampleData}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          샘플 데이터로 시작하기
        </SampleButton>
      </Content>

      {isLoading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
    </Container>
  );
};

export default FileUpload;
