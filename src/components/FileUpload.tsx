import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Colors, spacing, borderRadius, shadows } from '../utils/theme';
import { parseExcelFile, validateSurveyData } from '../utils/dataProcessor';
import { SurveyRecord } from '../types/index';

interface FileUploadProps {
  onUpload: (records: SurveyRecord[]) => void;
  onError: (error: string) => void;
}

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${Colors.primaryLight} 0%, ${Colors.white} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
`;

const Card = styled.div`
  background: ${Colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.xl};
  padding: ${spacing.xxl};
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${Colors.textMain};
  margin-bottom: ${spacing.md};
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${Colors.textSecondary};
  margin-bottom: ${spacing.lg};
`;

const DropZone = styled.div<{ isDragActive: boolean }>`
  border: 2px dashed ${(props) => (props.isDragActive ? Colors.primary : Colors.ui)};
  border-radius: ${borderRadius.md};
  padding: ${spacing.xl};
  background-color: ${(props) =>
    props.isDragActive ? Colors.primaryLight : Colors.uiLight};
  cursor: pointer;
  transition: all 0.3s ease;
  margin: ${spacing.lg} 0;

  &:hover {
    border-color: ${Colors.primary};
    background-color: ${Colors.primaryLight};
  }
`;

const DropIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${spacing.md};
`;

const DropText = styled.p`
  font-size: 16px;
  color: ${Colors.textMain};
  margin-bottom: ${spacing.sm};
`;

const DropHint = styled.p`
  font-size: 14px;
  color: ${Colors.textSecondary};
`;

const HiddenInput = styled.input`
  display: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-top: ${spacing.xl};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: ${spacing.md} ${spacing.lg};
  font-size: 16px;
  font-weight: 600;
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.variant === 'secondary'
      ? `
    background-color: ${Colors.ui};
    color: ${Colors.textMain};
    &:hover {
      background-color: ${Colors.textLight};
      transform: translateY(-2px);
      box-shadow: ${shadows.md};
    }
  `
      : `
    background-color: ${Colors.primary};
    color: white;
    &:hover {
      background-color: #E67E00;
      transform: translateY(-2px);
      box-shadow: ${shadows.md};
    }
    &:active {
      transform: translateY(0);
    }
  `}
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  border-left: 4px solid ${Colors.risk};
  padding: ${spacing.md};
  margin-top: ${spacing.md};
  border-radius: ${borderRadius.sm};
  color: ${Colors.risk};
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  border-left: 4px solid ${Colors.good};
  padding: ${spacing.md};
  margin-top: ${spacing.md};
  border-radius: ${borderRadius.sm};
  color: ${Colors.good};
  font-size: 14px;
`;

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, onError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>('');
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
    setFileName(file.name);

    try {
      const records = await parseExcelFile(file);
      const validation = validateSurveyData(records);

      if (!validation.isValid) {
        const errorMsg = validation.errors.join(', ');
        setError(errorMsg);
        onError(errorMsg);
        return;
      }

      setSuccess(
        `✓ ${records.length}명의 응답 데이터를 성공적으로 로드했습니다.`
      );
      setTimeout(() => {
        onUpload(records);
      }, 800);
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

  return (
    <Container>
      <Card>
        <Title>조직문화 진단 대시보드</Title>
        <Subtitle>
          Excel 파일을 업로드하면 자동으로 대시보드가 생성됩니다.
        </Subtitle>

        <DropZone
          isDragActive={isDragActive}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <DropIcon>📊</DropIcon>
          <DropText>
            {fileName ? `📁 ${fileName}` : 'Excel 파일을 여기에 끌어놓거나 클릭'}
          </DropText>
          <DropHint>
            2025_culture_survey_basic_rawdata.xlsx 형식의 파일을 지원합니다.
          </DropHint>
        </DropZone>

        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          disabled={isLoading}
        />

        <ButtonGroup>
          <Button
            variant="secondary"
            onClick={handleClick}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '파일 선택'}
          </Button>
          <Button onClick={handleClick} disabled={isLoading}>
            {isLoading ? '로드 중...' : '업로드'}
          </Button>
        </ButtonGroup>

        {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </Card>
    </Container>
  );
};

export default FileUpload;
