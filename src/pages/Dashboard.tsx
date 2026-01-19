import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Colors, spacing, borderRadius, getResponseRateColor } from '../utils/theme';
import KPICard, { KPIGrid, AlertBanner } from '../components/KPICard';
import DonutChart from '../components/DonutChart';
import HorizontalBarChart from '../components/HorizontalBarChart';
import TeamTable from '../components/TeamTable';
import { SurveyRecord } from '../types/index';
import {
  calculateDashboardSummary,
  calculateOrganizationStats,
  calculateTeamStats,
} from '../utils/dataProcessor';

interface DashboardProps {
  data: SurveyRecord[];
  onReset: () => void;
}

const Container = styled.div`
  min-height: 100vh;
  background-color: ${Colors.uiLight};
  padding: ${spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.xl};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${Colors.primaryLight};
  border-radius: ${borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const HeaderText = styled.div``;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: ${Colors.textMain};
  margin: 0;
`;

const HeaderSubtitle = styled.p`
  font-size: 13px;
  color: ${Colors.textSecondary};
  margin: 2px 0 0 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const DateBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${Colors.white};
  border: 1px solid ${Colors.ui};
  border-radius: ${borderRadius.md};
  font-size: 13px;
  color: ${Colors.textMain};
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${Colors.white};
  border: 1px solid ${Colors.ui};
  border-radius: ${borderRadius.md};
  font-size: 13px;
  color: ${Colors.textMain};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${Colors.primary};
    color: ${Colors.primary};
  }
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.lg};
  margin-bottom: ${spacing.xl};

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  margin-bottom: ${spacing.xl};
`;

const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  // 대시보드 요약 통계
  const summary = useMemo(() => calculateDashboardSummary(data), [data]);

  // 조직별 통계 (소속1 기준)
  const orgStats = useMemo(() => calculateOrganizationStats(data, '소속1'), [data]);

  // 팀별 통계
  const teamStats = useMemo(() => calculateTeamStats(data), [data]);

  // 미응답 인원이 많은 경우 경고
  const showWarning = summary.incompleteCount > summary.totalCount * 0.3;

  // 현재 날짜
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <LogoIcon>
            <span role="img" aria-label="chart">&#128202;</span>
          </LogoIcon>
          <HeaderText>
            <HeaderTitle>조직문화 진단</HeaderTitle>
            <HeaderSubtitle>진단 현황 대시보드</HeaderSubtitle>
          </HeaderText>
        </HeaderLeft>
        <HeaderRight>
          <DateBadge>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            기준일: {today}
          </DateBadge>
          <ResetButton onClick={onReset}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            새로 업로드
          </ResetButton>
        </HeaderRight>
      </Header>

      <Content>
        {/* KPI 카드 */}
        <KPIGrid>
          <KPICard
            title="전체 응답률"
            value={summary.responseRate}
            unit="%"
            subText={`${summary.completedCount}명 / ${summary.totalCount}명`}
            icon="users"
            status={summary.responseRate >= 70 ? 'good' : summary.responseRate >= 50 ? 'warning' : 'risk'}
            valueColor={getResponseRateColor(summary.responseRate)}
          />
          <KPICard
            title="응답 인원"
            value={summary.completedCount}
            subText="진단 완료"
            icon="check"
            status="good"
          />
          <KPICard
            title="미응답 인원"
            value={summary.incompleteCount}
            subText="진단 필요"
            icon="x"
            status={summary.incompleteCount > 0 ? 'risk' : 'good'}
          />
          <KPICard
            title="평균 만족도"
            value={summary.avgSatisfaction.toFixed(1)}
            unit="점"
            subText="5점 만점"
            icon="alert"
            status={summary.avgSatisfaction >= 4 ? 'good' : summary.avgSatisfaction >= 3 ? 'warning' : 'risk'}
          />
        </KPIGrid>

        {/* 경고 배너 */}
        {showWarning && (
          <AlertBanner
            type="warning"
            title="긴급 조치 필요"
            message={`미응답 인원이 ${summary.incompleteCount}명입니다. 진단 독려가 필요합니다.`}
          />
        )}

        {/* 차트 영역 */}
        <ChartGrid>
          <DonutChart
            data={orgStats}
            title="본부별 인원 분포"
          />
          <HorizontalBarChart
            data={orgStats}
            title="본부별 응답률 현황"
          />
        </ChartGrid>

        {/* 팀별 현황 테이블 */}
        <Section>
          <TeamTable
            data={teamStats}
            title="팀별 응답 현황"
          />
        </Section>
      </Content>
    </Container>
  );
};

export default Dashboard;
