import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Colors, spacing, borderRadius, shadows, CHART_COLORS } from '../utils/theme';
import { OrganizationStats } from '../types/index';

interface DonutChartProps {
  data: OrganizationStats[];
  title: string;
}

const Container = styled.div`
  background: ${Colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  box-shadow: ${shadows.sm};
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${Colors.textMain};
  margin: 0 0 ${spacing.lg} 0;
`;

const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
`;

const ChartWrapper = styled.div`
  width: 200px;
  height: 200px;
  position: relative;
`;

const CenterLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const CenterValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${Colors.textMain};
`;

const CenterText = styled.div`
  font-size: 12px;
  color: ${Colors.textSecondary};
`;

const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  flex: 1;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${(props) => props.color};
  flex-shrink: 0;
`;

const LegendLabel = styled.span`
  font-size: 13px;
  color: ${Colors.textMain};
  flex: 1;
`;

const LegendValue = styled.span`
  font-size: 13px;
  color: ${Colors.textSecondary};
`;

const CustomTooltipContainer = styled.div`
  background: ${Colors.white};
  border: 1px solid ${Colors.ui};
  border-radius: ${borderRadius.sm};
  padding: ${spacing.sm} ${spacing.md};
  box-shadow: ${shadows.md};
`;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <CustomTooltipContainer>
        <p style={{ margin: 0, fontWeight: 600 }}>{data.name}</p>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: Colors.textSecondary }}>
          {data.total}명 ({data.percent}%)
        </p>
      </CustomTooltipContainer>
    );
  }
  return null;
};

const DonutChart: React.FC<DonutChartProps> = ({ data, title }) => {
  const totalCount = data.reduce((sum, item) => sum + item.total, 0);

  const chartData = data.map((item, index) => ({
    name: item.name,
    value: item.total,
    total: item.total,
    percent: totalCount > 0 ? Math.round((item.total / totalCount) * 100) : 0,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <Container>
      <Title>{title}</Title>
      <ChartContainer>
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <CenterLabel>
            <CenterValue>{totalCount}</CenterValue>
            <CenterText>전체</CenterText>
          </CenterLabel>
        </ChartWrapper>
        <LegendContainer>
          {chartData.slice(0, 6).map((item, index) => (
            <LegendItem key={index}>
              <LegendColor color={item.color} />
              <LegendLabel>{item.name}</LegendLabel>
              <LegendValue>{item.percent}%</LegendValue>
            </LegendItem>
          ))}
          {chartData.length > 6 && (
            <LegendItem>
              <LegendColor color={Colors.textLight} />
              <LegendLabel>기타 ({chartData.length - 6}개)</LegendLabel>
            </LegendItem>
          )}
        </LegendContainer>
      </ChartContainer>
    </Container>
  );
};

export default DonutChart;
