import React, { useState } from 'react';
import styled from 'styled-components';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { Colors, spacing, borderRadius, shadows, typography } from '../utils/theme';

interface ImportanceDataPoint {
  x: number;
  y: number;
  label: string;
  value: number;
  category: string;
}

interface ImportanceSatisfactionChartProps {
  data: ImportanceDataPoint[];
  selectedElement?: string;
  onSelectElement?: (element: string) => void;
  onDragElement?: (element: string) => void;
  isDragEnabled?: boolean;
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
  margin-bottom: ${spacing.md};
`;

const Description = styled.p`
  font-size: 13px;
  color: ${Colors.textSecondary};
  margin-bottom: ${spacing.lg};
  line-height: 1.5;
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${spacing.lg};
  overflow-x: auto;
`;

const Legend = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.lg};
  padding-top: ${spacing.lg};
  border-top: 1px solid ${Colors.ui};
`;

const QuadrantBox = styled.div<{ color: string }>`
  padding: ${spacing.md};
  border-left: 4px solid ${(props) => props.color};
  border-radius: ${borderRadius.sm};
  background-color: ${(props) => `${props.color}10`};
`;

const QuadrantTitle = styled.h4`
  font-weight: 700;
  font-size: 13px;
  color: ${Colors.textMain};
  margin-bottom: ${spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const QuadrantDesc = styled.p`
  font-size: 12px;
  color: ${Colors.textSecondary};
  line-height: 1.4;
  margin: 0;
`;

const ElementList = styled.div`
  background: ${Colors.uiLight};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  margin-top: ${spacing.lg};
  max-height: 200px;
  overflow-y: auto;
`;

const ElementItem = styled.div<{ isDraggable?: boolean; isSelected?: boolean }>`
  padding: ${spacing.sm} ${spacing.md};
  margin-bottom: ${spacing.sm};
  background: ${(props) => (props.isSelected ? Colors.primaryLight : Colors.white)};
  border: 1px solid
    ${(props) =>
      props.isSelected ? Colors.primary : Colors.ui};
  border-radius: ${borderRadius.sm};
  cursor: ${(props) => (props.isDraggable ? 'grab' : 'pointer')};
  font-size: 13px;
  color: ${Colors.textMain};
  transition: all 0.2s ease;

  &:hover {
    background: ${Colors.primaryLight};
    border-color: ${Colors.primary};
    transform: translateX(4px);
  }

  &:active {
    cursor: ${(props) => (props.isDraggable ? 'grabbing' : 'pointer')};
  }
`;

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          background: Colors.white,
          padding: spacing.md,
          borderRadius: borderRadius.sm,
          border: `1px solid ${Colors.ui}`,
          boxShadow: shadows.md,
        }}
      >
        <p style={{ margin: 0, fontWeight: 600, color: Colors.textMain }}>
          {data.label}
        </p>
        <p style={{ margin: `${spacing.xs} 0 0 0`, fontSize: '12px', color: Colors.textSecondary }}>
          만족도: {data.x.toFixed(1)}점
        </p>
        <p style={{ margin: `${spacing.xs} 0 0 0`, fontSize: '12px', color: Colors.textSecondary }}>
          중요도: {data.y.toFixed(1)}점
        </p>
      </div>
    );
  }
  return null;
};

const ImportanceSatisfactionChart: React.FC<ImportanceSatisfactionChartProps> = ({
  data,
  selectedElement,
  onSelectElement,
  onDragElement,
  isDragEnabled = true,
}) => {
  const [draggedElement, setDraggedElement] = useState<string>('');

  const handleDragStart = (e: React.DragEvent, element: string) => {
    setDraggedElement(element);
    if (onDragElement) {
      onDragElement(element);
    }
  };

  const handleElementClick = (element: string) => {
    if (onSelectElement) {
      onSelectElement(element);
    }
  };

  const quadrants = [
    {
      name: '중점 개선 영역',
      color: Colors.risk,
      desc: '중요도는 높지만 만족도가 낮습니다.\n즉각적인 개선이 필요합니다.',
    },
    {
      name: '유지 강화 영역',
      color: Colors.good,
      desc: '중요도와 만족도가 모두 높습니다.\n현 수준을 계속 유지하세요.',
    },
    {
      name: '점진적 개선 영역',
      color: Colors.warning,
      desc: '만족도는 높지만 상대 중요도가 낮습니다.\n현상 유지하되 필요시 개선하세요.',
    },
    {
      name: '현상 유지 영역',
      color: Colors.neutral,
      desc: '중요도와 만족도가 모두 낮습니다.\n현 상태를 유지하되 모니터링하세요.',
    },
  ];

  return (
    <Container>
      <Title>중요도 분석 - 만족도 vs 중요도 분석</Title>
      <Description>
        각 요소의 중요도와 만족도를 비교하여 개선 우선순위를 결정합니다.
        요소를 드래그하여 다양한 시나리오를 분석할 수 있습니다.
      </Description>

      <ChartContainer>
        <ScatterChart
          width={600}
          height={400}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={Colors.ui} />
          <XAxis
            type="number"
            dataKey="x"
            name="만족도"
            domain={[0, 100]}
            stroke={Colors.textSecondary}
            label={{ value: '만족도 →', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="중요도"
            domain={[0, 100]}
            stroke={Colors.textSecondary}
            label={{ value: '← 중요도', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Reference lines for quadrants */}
          <ReferenceLine
            x={50}
            stroke={Colors.ui}
            strokeDasharray="5 5"
            opacity={0.5}
          />
          <ReferenceLine
            y={50}
            stroke={Colors.ui}
            strokeDasharray="5 5"
            opacity={0.5}
          />

          {/* Data points */}
          <Scatter
            name="영역"
            data={data}
            fill={Colors.primary}
            onClick={(e) => handleElementClick(e.category)}
            cursor="pointer"
          />
        </ScatterChart>
      </ChartContainer>

      <Legend>
        {quadrants.map((quad) => (
          <QuadrantBox key={quad.name} color={quad.color}>
            <QuadrantTitle>{quad.name}</QuadrantTitle>
            <QuadrantDesc>{quad.desc}</QuadrantDesc>
          </QuadrantBox>
        ))}
      </Legend>

      {isDragEnabled && (
        <>
          <div style={{ marginTop: spacing.lg }}>
            <h3
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: Colors.textMain,
                marginBottom: spacing.md,
              }}
            >
              📊 분석 대상 선택 (드래그 활성화)
            </h3>
            <ElementList>
              {data.map((item) => (
                <ElementItem
                  key={item.category}
                  isDraggable={isDragEnabled}
                  isSelected={selectedElement === item.category}
                  draggable={isDragEnabled}
                  onDragStart={(e) => handleDragStart(e, item.category)}
                  onClick={() => handleElementClick(item.category)}
                >
                  {item.label}
                  {isDragEnabled && <span style={{ float: 'right', fontSize: '10px', opacity: 0.5 }}>⤓</span>}
                </ElementItem>
              ))}
            </ElementList>
          </div>
        </>
      )}
    </Container>
  );
};

export default ImportanceSatisfactionChart;
