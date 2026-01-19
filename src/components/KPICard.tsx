import React from 'react';
import styled from 'styled-components';
import { Colors, spacing, borderRadius, shadows } from '../utils/theme';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  subText?: string;
  icon: 'users' | 'check' | 'x' | 'alert';
  status?: 'good' | 'warning' | 'risk' | 'neutral';
  valueColor?: string;
}

const Card = styled.div`
  background: ${Colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  box-shadow: ${shadows.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.p`
  font-size: 14px;
  color: ${Colors.textSecondary};
  margin: 0 0 ${spacing.xs} 0;
`;

const ValueContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

const Value = styled.span<{ color?: string }>`
  font-size: 36px;
  font-weight: 700;
  color: ${(props) => props.color || Colors.textMain};
  line-height: 1.2;
`;

const Unit = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: ${Colors.textSecondary};
`;

const SubText = styled.p`
  font-size: 13px;
  color: ${Colors.textSecondary};
  margin: ${spacing.xs} 0 0 0;
`;

const IconWrapper = styled.div<{ status?: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => {
    switch (props.status) {
      case 'good':
        return '#ECFDF5';
      case 'warning':
        return '#FEF3C7';
      case 'risk':
        return '#FEF2F2';
      default:
        return Colors.primaryLight;
    }
  }};
  color: ${(props) => {
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
`;

const IconSvg = ({ type }: { type: string }) => {
  switch (type) {
    case 'users':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'check':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="9 12 12 15 16 10" />
        </svg>
      );
    case 'x':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    case 'alert':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    default:
      return null;
  }
};

export const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${spacing.lg};
  margin-bottom: ${spacing.xl};

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  subText,
  icon,
  status,
  valueColor,
}) => {
  return (
    <Card>
      <Content>
        <Title>{title}</Title>
        <ValueContainer>
          <Value color={valueColor}>{value}</Value>
          {unit && <Unit>{unit}</Unit>}
        </ValueContainer>
        {subText && <SubText>{subText}</SubText>}
      </Content>
      <IconWrapper status={status}>
        <IconSvg type={icon} />
      </IconWrapper>
    </Card>
  );
};

// 알림 배너 컴포넌트
interface AlertBannerProps {
  type: 'warning' | 'info';
  title: string;
  message: string;
}

const BannerWrapper = styled.div<{ type: string }>`
  background-color: ${(props) => props.type === 'warning' ? Colors.alertBg : Colors.primaryLight};
  border: 1px solid ${(props) => props.type === 'warning' ? Colors.alertBorder : Colors.primaryMuted};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md} ${spacing.lg};
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
`;

const BannerIcon = styled.div<{ type: string }>`
  color: ${(props) => props.type === 'warning' ? Colors.risk : Colors.primary};
  flex-shrink: 0;
`;

const BannerContent = styled.div``;

const BannerTitle = styled.p<{ type: string }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.type === 'warning' ? Colors.risk : Colors.primary};
  margin: 0;
`;

const BannerMessage = styled.p`
  font-size: 13px;
  color: ${Colors.textSecondary};
  margin: 2px 0 0 0;
`;

export const AlertBanner: React.FC<AlertBannerProps> = ({ type, title, message }) => {
  return (
    <BannerWrapper type={type}>
      <BannerIcon type={type}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </BannerIcon>
      <BannerContent>
        <BannerTitle type={type}>{title}</BannerTitle>
        <BannerMessage>{message}</BannerMessage>
      </BannerContent>
    </BannerWrapper>
  );
};

export default KPICard;
