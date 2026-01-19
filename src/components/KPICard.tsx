import React from 'react';
import styled from 'styled-components';
import { Colors, spacing, borderRadius, shadows, typography } from '@utils/theme';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status?: 'good' | 'warning' | 'risk' | 'neutral';
  description?: string;
}

const Card = styled.div<{ status?: string }>`
  background: ${Colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  box-shadow: ${shadows.md};
  border-top: 4px solid
    ${(props) => {
      switch (props.status) {
        case 'good':
          return Colors.good;
        case 'warning':
          return Colors.warning;
        case 'risk':
          return Colors.risk;
        default:
          return Colors.primary;
      }
    }};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.lg};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.md};
`;

const IconContainer = styled.div`
  font-size: 32px;
  line-height: 1;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${Colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

const Content = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${spacing.sm};
`;

const Value = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${Colors.textMain};
`;

const Unit = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${Colors.textSecondary};
`;

const TrendContainer = styled.div<{ trend?: 'up' | 'down' | 'stable' }>`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => {
    switch (props.trend) {
      case 'up':
        return Colors.good;
      case 'down':
        return Colors.risk;
      default:
        return Colors.textSecondary;
    }
  }};
`;

const Description = styled.p`
  font-size: 12px;
  color: ${Colors.textSecondary};
  margin: ${spacing.md} 0 0 0;
  line-height: 1.5;
`;

const TrendIcon = styled.span`
  display: inline-block;
  font-size: 16px;
`;

interface KPIGridProps {
  children: React.ReactNode;
}

export const KPIGrid = styled.div<KPIGridProps>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${spacing.lg};
  margin-bottom: ${spacing.xl};
`;

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  status,
  description,
}) => {
  const getTrendIcon = (t?: string) => {
    switch (t) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      case 'stable':
        return '→';
      default:
        return '';
    }
  };

  return (
    <Card status={status}>
      <Header>
        <Title>{title}</Title>
        <IconContainer>{icon}</IconContainer>
      </Header>

      <Content>
        <Value>{value}</Value>
        {unit && <Unit>{unit}</Unit>}
      </Content>

      {trend && trendValue && (
        <TrendContainer trend={trend}>
          <TrendIcon>{getTrendIcon(trend)}</TrendIcon>
          <span>{trendValue}</span>
        </TrendContainer>
      )}

      {description && <Description>{description}</Description>}
    </Card>
  );
};

export default KPICard;
