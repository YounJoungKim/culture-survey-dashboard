import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Colors, spacing, borderRadius, shadows, getResponseRateColor } from '../utils/theme';
import { OrganizationStats } from '../types/index';

interface HorizontalBarChartProps {
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

const ChartContainer = styled.div<{ height: number }>`
  width: 100%;
  height: ${(props) => props.height}px;
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: ${spacing.lg};
  margin-top: ${spacing.md};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: 12px;
  color: ${Colors.textSecondary};
`;

const LegendDot = styled.span<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const CustomLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text
      x={x + width + 8}
      y={y + 14}
      fill={Colors.textSecondary}
      fontSize={12}
    >
      {value}%
    </text>
  );
};

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data, title }) => {
  // 응답률 기준 정렬 (높은 순)
  const sortedData = [...data].sort((a, b) => b.responseRate - a.responseRate).slice(0, 8);
  const chartHeight = Math.max(sortedData.length * 40 + 40, 200);

  const chartData = sortedData.map((item) => ({
    name: item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name,
    fullName: item.name,
    responseRate: item.responseRate,
    color: getResponseRateColor(item.responseRate),
  }));

  return (
    <Container>
      <Title>{title}</Title>
      <ChartContainer height={chartHeight}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 50, left: 80, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 11, fill: Colors.textSecondary }}
              axisLine={{ stroke: Colors.ui }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: Colors.textMain }}
              axisLine={false}
              tickLine={false}
              width={75}
            />
            <Bar
              dataKey="responseRate"
              radius={[0, 4, 4, 0]}
              barSize={20}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="responseRate" content={<CustomLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <Legend>
        <LegendItem>
          <LegendDot color={Colors.good} />
          <span>90% 이상</span>
        </LegendItem>
        <LegendItem>
          <LegendDot color={Colors.warning} />
          <span>70-89%</span>
        </LegendItem>
        <LegendItem>
          <LegendDot color={Colors.risk} />
          <span>70% 미만</span>
        </LegendItem>
      </Legend>
    </Container>
  );
};

export default HorizontalBarChart;
