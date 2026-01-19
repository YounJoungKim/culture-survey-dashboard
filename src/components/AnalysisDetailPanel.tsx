import React from 'react';
import styled from 'styled-components';
import { Colors, spacing, borderRadius, shadows } from '@utils/theme';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalysisDetail {
  element: string;
  satisfaction: number;
  importance: number;
  quadrant: string;
  departmentComparison: Array<{
    name: string;
    score: number;
  }>;
  recommendation: string;
  variance: number;
}

interface AnalysisDetailPanelProps {
  analysis?: AnalysisDetail;
  isLoading?: boolean;
}

const Container = styled.div`
  background: ${Colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  box-shadow: ${shadows.md};
  margin-bottom: ${spacing.lg};
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${Colors.textMain};
  margin-bottom: ${spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing.xl};
  color: ${Colors.textSecondary};
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.lg};
  margin-bottom: ${spacing.lg};
`;

const Card = styled.div`
  background: ${Colors.uiLight};
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
`;

const CardTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${Colors.textSecondary};
  margin-bottom: ${spacing.md};
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.md};
`;

const StatItem = styled.div`
  background: ${Colors.white};
  padding: ${spacing.md};
  border-radius: ${borderRadius.sm};
  text-align: center;
`;

const StatLabel = styled.p`
  font-size: 12px;
  color: ${Colors.textSecondary};
  margin-bottom: ${spacing.sm};
  margin: 0;
`;

const StatValue = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: ${Colors.primary};
  margin: 0;
`;

const QuadrantBadge = styled.div<{ type: string }>`
  display: inline-block;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.type) {
      case '중점 개선 영역':
        return '#ffebee';
      case '유지 강화 영역':
        return '#e8f5e9';
      case '점진적 개선 영역':
        return '#fff3e0';
      default:
        return '#eceff1';
    }
  }};
  color: ${(props) => {
    switch (props.type) {
      case '중점 개선 영역':
        return Colors.risk;
      case '유지 강화 영역':
        return Colors.good;
      case '점진적 개선 영역':
        return Colors.warning;
      default:
        return Colors.neutral;
    }
  }};
`;

const RecommendationBox = styled.div`
  background: linear-gradient(
    135deg,
    ${Colors.primaryLight} 0%,
    ${Colors.uiLight} 100%
  );
  border-left: 4px solid ${Colors.primary};
  padding: ${spacing.lg};
  border-radius: ${borderRadius.md};
  margin-top: ${spacing.lg};
`;

const RecommendationTitle = styled.p`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${Colors.textSecondary};
  margin: 0 0 ${spacing.sm} 0;
`;

const RecommendationText = styled.p`
  font-size: 14px;
  color: ${Colors.textMain};
  line-height: 1.6;
  margin: 0;
`;

const ChartContainer = styled.div`
  grid-column: 1 / -1;
  background: ${Colors.white};
  padding: ${spacing.lg};
  border-radius: ${borderRadius.md};
  border: 1px solid ${Colors.ui};
`;

const Loading = styled.div`
  text-align: center;
  padding: ${spacing.xl};
  color: ${Colors.textSecondary};
`;

const AnalysisDetailPanel: React.FC<AnalysisDetailPanelProps> = ({
  analysis,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Container>
        <Title>선택 요소 상세 분석</Title>
        <Loading>데이터를 로드 중입니다...</Loading>
      </Container>
    );
  }

  if (!analysis) {
    return (
      <Container>
        <Title>선택 요소 상세 분석</Title>
        <EmptyState>
          중요도 분석 차트에서 요소를 선택하면 상세 분석 결과가 표시됩니다.
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>선택 요소 상세 분석 - {analysis.element}</Title>

      <Content>
        <Card>
          <CardTitle>주요 지표</CardTitle>
          <StatGrid>
            <StatItem>
              <StatLabel>만족도</StatLabel>
              <StatValue>{analysis.satisfaction.toFixed(1)}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>중요도</StatLabel>
              <StatValue>{analysis.importance.toFixed(1)}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>편차</StatLabel>
              <StatValue>{analysis.variance.toFixed(1)}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>분류</StatLabel>
              <QuadrantBadge type={analysis.quadrant}>
                {analysis.quadrant}
              </QuadrantBadge>
            </StatItem>
          </StatGrid>
        </Card>

        <Card>
          <CardTitle>분석 결과</CardTitle>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.md,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '12px',
                  color: Colors.textSecondary,
                  margin: '0 0 4px 0',
                }}
              >
                사분면
              </p>
              <QuadrantBadge type={analysis.quadrant}>
                {analysis.quadrant}
              </QuadrantBadge>
            </div>
            <div>
              <p
                style={{
                  fontSize: '12px',
                  color: Colors.textSecondary,
                  margin: '0 0 4px 0',
                }}
              >
                편차도
              </p>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: Colors.ui,
                  borderRadius: borderRadius.sm,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(analysis.variance * 2, 100)}%`,
                    background: Colors.primary,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: Colors.textSecondary,
                  margin: '4px 0 0 0',
                }}
              >
                {analysis.variance.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        {analysis.departmentComparison &&
          analysis.departmentComparison.length > 0 && (
            <ChartContainer>
              <CardTitle>부서별 비교</CardTitle>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analysis.departmentComparison}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={Colors.ui}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={Colors.textSecondary}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke={Colors.textSecondary}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: Colors.white,
                      border: `1px solid ${Colors.ui}`,
                      borderRadius: borderRadius.sm,
                    }}
                  />
                  <Bar
                    dataKey="score"
                    fill={Colors.primary}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
      </Content>

      <RecommendationBox>
        <RecommendationTitle>개선 권장사항</RecommendationTitle>
        <RecommendationText>{analysis.recommendation}</RecommendationText>
      </RecommendationBox>
    </Container>
  );
};

export default AnalysisDetailPanel;
