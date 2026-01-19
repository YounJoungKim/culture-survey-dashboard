import React from 'react';
import styled from 'styled-components';
import { Colors, spacing, borderRadius, shadows } from '../utils/theme';

interface HeatmapData {
  category: string;
  scores: {
    [key: string]: number;
  };
}

interface HeatmapTableProps {
  data: HeatmapData[];
  departments: string[];
  title?: string;
}

const Container = styled.div`
  background: ${Colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  box-shadow: ${shadows.md};
  margin-bottom: ${spacing.lg};
  overflow-x: auto;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${Colors.textMain};
  margin-bottom: ${spacing.lg};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: ${Colors.primaryLight};
  color: ${Colors.textMain};
  padding: ${spacing.md};
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 2px solid ${Colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Td = styled.td`
  padding: ${spacing.md};
  border-bottom: 1px solid ${Colors.ui};
`;

const Tr = styled.tr`
  &:hover {
    background-color: ${Colors.uiLight};
  }
`;

const CategoryCell = styled.div`
  font-weight: 600;
  color: ${Colors.textMain};
  font-size: 14px;
`;

interface ScoreCellProps {
  score: number;
  maxScore?: number;
}

const ScoreCell = styled.div<ScoreCellProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.sm};
  font-weight: 600;
  font-size: 14px;
  min-width: 60px;
  text-align: center;
  background-color: ${(props) => {
    const percentage = (props.score / (props.maxScore || 100)) * 100;
    if (percentage >= 80) {
      return Colors.good;
    } else if (percentage >= 60) {
      return Colors.warning;
    } else {
      return Colors.risk;
    }
  }};
  color: ${Colors.white};
  box-shadow: ${shadows.sm};
`;

const Legend = styled.div`
  display: flex;
  gap: ${spacing.lg};
  margin-top: ${spacing.lg};
  padding-top: ${spacing.lg};
  border-top: 1px solid ${Colors.ui};
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: 12px;
  color: ${Colors.textSecondary};
`;

const LegendBox = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.color};
  border-radius: ${borderRadius.sm};
`;

const HeatmapTable: React.FC<HeatmapTableProps> = ({
  data,
  departments,
  title = '영역별 만족도 현황 (Heatmap)',
}) => {
  const maxScore = 100;

  return (
    <Container>
      <Title>{title}</Title>
      <Table>
        <thead>
          <Tr>
            <Th>영역</Th>
            {departments.map((dept) => (
              <Th key={dept}>{dept}</Th>
            ))}
          </Tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <Tr key={row.category}>
              <Td>
                <CategoryCell>{row.category}</CategoryCell>
              </Td>
              {departments.map((dept) => {
                const score = row.scores[dept] || 0;
                return (
                  <Td key={`${row.category}-${dept}`}>
                    <ScoreCell score={score} maxScore={maxScore}>
                      {score.toFixed(1)}
                    </ScoreCell>
                  </Td>
                );
              })}
            </Tr>
          ))}
        </tbody>
      </Table>

      <Legend>
        <LegendItem>
          <LegendBox color={Colors.good} />
          80점 이상 (우수)
        </LegendItem>
        <LegendItem>
          <LegendBox color={Colors.warning} />
          60~80점 (양호)
        </LegendItem>
        <LegendItem>
          <LegendBox color={Colors.risk} />
          60점 미만 (개선필요)
        </LegendItem>
      </Legend>
    </Container>
  );
};

export default HeatmapTable;
