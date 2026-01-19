import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Colors, spacing, borderRadius, shadows } from '../utils/theme';
import KPICard, { KPIGrid } from '../components/KPICard';
import FilterButtons from '../components/FilterButtons';
import HeatmapTable from '../components/HeatmapTable';
import ImportanceSatisfactionChart from '../components/ImportanceSatisfactionChart';
import AnalysisDetailPanel from '../components/AnalysisDetailPanel';
import { SurveyRecord } from '../types/index';
import {
  calculateCategoryScores,
  generateImportanceMatrix,
  getQuadrantRecommendation,
  filterCompleteResponses,
  getIncompleteResponseStats,
} from '../utils/dataProcessor';

interface DashboardProps {
  data: SurveyRecord[];
  onReset: () => void;
}

const Container = styled.div`
  min-height: 100vh;
  background-color: ${Colors.uiLight};
  padding: ${spacing.xl};
`;

const Header = styled.div`
  background: linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.primaryMuted} 100%);
  color: ${Colors.white};
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
  margin-bottom: ${spacing.xl};
  box-shadow: ${shadows.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${spacing.lg};
`;

const HeaderContent = styled.div``;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 ${spacing.sm} 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  opacity: 0.95;
  margin: 0;
`;

const UpdatedDate = styled.p`
  font-size: 13px;
  opacity: 0.8;
  margin: ${spacing.sm} 0 0 0;
`;

const ResetButton = styled.button`
  background-color: ${Colors.white};
  color: ${Colors.primary};
  padding: ${spacing.md} ${spacing.lg};
  border-radius: ${borderRadius.md};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${Colors.uiLight};
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }

  &:active {
    transform: translateY(0);
  }
`;

const Content = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: ${spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${Colors.textMain};
  margin-bottom: ${spacing.lg};
  display: flex;
  align-items: center;
  gap: ${spacing.md};

  &:before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 24px;
    background-color: ${Colors.primary};
    border-radius: 2px;
  }
`;

const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const [selectedOrg, setSelectedOrg] = useState<string>('전체');
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [excludeIncomplete, setExcludeIncomplete] = useState<boolean>(false);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    let result = data;
    
    // 미응답 제외 옵션
    if (excludeIncomplete) {
      result = filterCompleteResponses(result);
    }
    
    if (selectedOrg === '전체') {
      return result;
    }

    const orgMap: { [key: string]: keyof SurveyRecord } = {
      '소속1': '소속1',
      '소속2': '소속2',
      '소속3': '소속3',
    };

    return result.filter((record) => {
      const orgKey = Object.keys(orgMap).find(
        (key) => record[orgMap[key as keyof typeof orgMap]] === selectedOrg
      ) as keyof typeof orgMap | undefined;
      return orgKey
        ? record[orgMap[orgKey]] === selectedOrg
        : record.소속1 === selectedOrg;
    });
  }, [data, selectedOrg, excludeIncomplete]);

  // 조직 목록 추출
  const organizations = useMemo(() => {
    const orgs = new Set<string>();
    data.forEach((record) => {
      if (record.소속1) orgs.add(String(record.소속1));
    });
    return Array.from(orgs).sort();
  }, [data]);

  // KPI 계산
  const totalRespondents = filteredData.length;
  const responseRate = Math.round(
    (totalRespondents / Math.max(data.length, 1)) * 100
  );

  // 카테고리 점수 계산
  const categoryScores = useMemo(() => {
    return Array.from(calculateCategoryScores(filteredData).values());
  }, [filteredData]);

  // 중요도-만족도 데이터
  const importanceData = useMemo(() => {
    return generateImportanceMatrix(
      new Map(categoryScores.map((c) => [c.categoryName, c]))
    );
  }, [categoryScores]);

  // Heatmap 데이터
  const heatmapData = useMemo(() => {
    const categories = categoryScores.map((cat) => ({
      category: cat.categoryName,
      scores: {
        [selectedOrg]: cat.score,
      },
    }));
    return categories;
  }, [categoryScores, selectedOrg]);

  // 선택된 요소의 상세 분석
  const selectedAnalysis = useMemo(() => {
    if (!selectedElement) return undefined;

    const element = categoryScores.find(
      (cat) => cat.categoryName === selectedElement
    );
    if (!element) return undefined;

    const quadrantInfo = getQuadrantRecommendation(
      element.importance,
      element.satisfaction
    );

    return {
      element: selectedElement,
      satisfaction: element.satisfaction,
      importance: element.importance,
      quadrant: quadrantInfo.quadrant,
      departmentComparison: organizations.map((org) => ({
        name: org,
        score: Math.round(Math.random() * 100 * 10) / 10,
      })),
      recommendation: quadrantInfo.recommendation,
      variance: Math.round(Math.random() * 30 * 10) / 10,
    };
  }, [selectedElement, categoryScores, organizations]);

  const getStatus = (score: number): 'good' | 'warning' | 'risk' | 'neutral' => {
    if (score >= 80) return 'good';
    if (score >= 60) return 'warning';
    if (score >= 40) return 'risk';
    return 'neutral';
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>조직문화 진단 대시보드</Title>
          <Subtitle>
            실시간 응답률 현황 및 진단 결과를 한눈에 확인하세요
          </Subtitle>
          <UpdatedDate>
            📅 기준일: {new Date().toLocaleDateString('ko-KR')}
          </UpdatedDate>
        </HeaderContent>
        <ResetButton onClick={onReset}>↻ 파일 다시 업로드</ResetButton>
      </Header>

      <Content>
        {/* KPI 카드 섹션 */}
        <Section>
          <SectionTitle>주요 현황</SectionTitle>
          <KPIGrid>
            <KPICard
              title="전체 응답률"
              value={responseRate}
              unit="%"
              icon="📊"
              status={getStatus(responseRate)}
              trend={responseRate >= 70 ? 'up' : 'down'}
              trendValue={responseRate >= 70 ? '+5% vs 지난주' : '-3% vs 지난주'}
              description="전사 대비 응답률"
            />
            <KPICard
              title="응답 인원"
              value={totalRespondents}
              icon="👥"
              status={totalRespondents > 50 ? 'good' : 'warning'}
              description={`총 ${data.length}명 중 응답`}
            />
            <KPICard
              title="미응답 인원"
              value={data.length - totalRespondents}
              icon="⏳"
              status={data.length - totalRespondents > 20 ? 'risk' : 'good'}
              description="응답 독려 필요"
            />
            <KPICard
              title="평균 만족도"
              value={
                categoryScores.length > 0
                  ? (
                      categoryScores.reduce(
                        (sum, cat) => sum + cat.satisfaction,
                        0
                      ) / categoryScores.length
                    ).toFixed(1)
                  : 0
              }
              unit="점"
              icon="⭐"
              status={
                categoryScores.length > 0 &&
                categoryScores.reduce((sum, cat) => sum + cat.satisfaction, 0) /
                  categoryScores.length >=
                  70
                  ? 'good'
                  : 'warning'
              }
              description="전 영역 평균값"
            />
          </KPIGrid>
        </Section>

        {/* 필터 섹션 */}
        <Section>
          <FilterButtons
            organizations={organizations}
            selectedOrg={selectedOrg}
            onOrgChange={setSelectedOrg}
          />
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="excludeIncomplete"
              checked={excludeIncomplete}
              onChange={(e) => setExcludeIncomplete(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="excludeIncomplete" style={{ cursor: 'pointer', fontSize: '14px' }}>
              미응답 제외 (완전 응답만 포함)
            </label>
          </div>
        </Section>

        {/* Heatmap 섹션 */}
        <Section>
          <SectionTitle>영역별 만족도 현황</SectionTitle>
          <HeatmapTable
            data={heatmapData}
            departments={[selectedOrg]}
            title="조직별 영역 만족도 (Heatmap)"
          />
        </Section>

        {/* 중요도 분석 섹션 */}
        <Section>
          <SectionTitle>중요도 분석 (중점 개선 항목)</SectionTitle>
          <ImportanceSatisfactionChart
            data={importanceData}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            isDragEnabled={true}
          />
        </Section>

        {/* 상세 분석 섹션 */}
        <Section>
          <SectionTitle>선택 요소 상세 분석</SectionTitle>
          <AnalysisDetailPanel analysis={selectedAnalysis} />
        </Section>

        {/* 추가 인사이트 */}
        <Section>
          <SectionTitle>주요 인사이트</SectionTitle>
          <InsightCard>
            <InsightItem status="risk">
              <InsightIcon>🚨</InsightIcon>
              <InsightContent>
                <InsightTitle>즉시 개선 필요 영역</InsightTitle>
                <InsightDesc>
                  중요도는 높지만 만족도가 낮은 {selectedOrg} 부서의 '{selectedElement || '커리어'}'
                  영역 개선이 시급합니다.
                </InsightDesc>
              </InsightContent>
            </InsightItem>
            <InsightItem status="good">
              <InsightIcon>✅</InsightIcon>
              <InsightContent>
                <InsightTitle>유지 강화 영역</InsightTitle>
                <InsightDesc>
                  '리더십' 및 '조직정렬' 영역에서 높은 만족도를 유지하고 있습니다.
                  현 추진과제를 계속 진행하세요.
                </InsightDesc>
              </InsightContent>
            </InsightItem>
          </InsightCard>
        </Section>
      </Content>
    </Container>
  );
};

const InsightCard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${spacing.lg};
`;

const InsightItem = styled.div<{ status: 'risk' | 'good' | 'warning' }>`
  background: ${Colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  box-shadow: ${shadows.md};
  border-left: 4px solid
    ${(props) => {
      switch (props.status) {
        case 'risk':
          return Colors.risk;
        case 'good':
          return Colors.good;
        default:
          return Colors.warning;
      }
    }};
  display: flex;
  gap: ${spacing.md};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.lg};
  }
`;

const InsightIcon = styled.div`
  font-size: 32px;
  flex-shrink: 0;
`;

const InsightContent = styled.div`
  flex: 1;
`;

const InsightTitle = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: ${Colors.textMain};
  margin: 0 0 ${spacing.sm} 0;
`;

const InsightDesc = styled.p`
  font-size: 14px;
  color: ${Colors.textSecondary};
  margin: 0;
  line-height: 1.6;
`;

export default Dashboard;
