import React from 'react';
import styled from 'styled-components';
import { Colors, spacing, borderRadius, shadows } from '../utils/theme';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: help;
`;

const TooltipContent = styled.div<{ position: string }>`
  visibility: hidden;
  background-color: ${Colors.textMain};
  color: ${Colors.white};
  text-align: center;
  border-radius: ${borderRadius.sm};
  padding: ${spacing.sm} ${spacing.md};
  position: absolute;
  z-index: 1000;
  width: max-content;
  white-space: nowrap;
  font-size: 12px;
  box-shadow: ${shadows.md};
  opacity: 0;
  transition: opacity 0.3s ease;

  ${(props) => {
    switch (props.position) {
      case 'top':
        return `
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'bottom':
        return `
          top: 125%;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'left':
        return `
          right: 105%;
          top: 50%;
          transform: translateY(-50%);
        `;
      case 'right':
        return `
          left: 105%;
          top: 50%;
          transform: translateY(-50%);
        `;
      default:
        return `
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
        `;
    }
  }}

  &:before {
    content: '';
    position: absolute;
    ${(props) => {
      switch (props.position) {
        case 'top':
          return `
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px 5px 0 5px;
            border-style: solid;
            border-color: ${Colors.textMain} transparent transparent transparent;
          `;
        case 'bottom':
          return `
            bottom: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 0 5px 5px 5px;
            border-style: solid;
            border-color: transparent transparent ${Colors.textMain} transparent;
          `;
        case 'left':
          return `
            left: 100%;
            top: 50%;
            margin-top: -5px;
            border-width: 5px 0 5px 5px;
            border-style: solid;
            border-color: transparent transparent transparent ${Colors.textMain};
          `;
        case 'right':
          return `
            right: 100%;
            top: 50%;
            margin-top: -5px;
            border-width: 5px 5px 5px 0;
            border-style: solid;
            border-color: transparent ${Colors.textMain} transparent transparent;
          `;
        default:
          return '';
      }
    }}
  }
`;

const TooltipTrigger = styled.div`
  &:hover ${TooltipContent} {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  return (
    <TooltipContainer>
      <TooltipTrigger>
        {children}
        <TooltipContent position={position}>{content}</TooltipContent>
      </TooltipTrigger>
    </TooltipContainer>
  );
};

export default Tooltip;

// Badge Component
export const Badge = styled.span<{ variant?: 'primary' | 'success' | 'warning' | 'error' }>`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.variant) {
      case 'success':
        return Colors.good;
      case 'warning':
        return Colors.warning;
      case 'error':
        return Colors.risk;
      default:
        return Colors.primary;
    }
  }};
  color: ${Colors.white};
`;

// Loading Spinner
export const Spinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid ${Colors.ui};
  border-radius: 50%;
  border-top-color: ${Colors.primary};
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Divider
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${Colors.ui};
  margin: ${spacing.lg} 0;
`;

// Progress Bar
export const ProgressBar = styled.div<{ value: number }>`
  width: 100%;
  height: 8px;
  background-color: ${Colors.ui};
  border-radius: ${borderRadius.full};
  overflow: hidden;

  &:after {
    content: '';
    display: block;
    height: 100%;
    width: ${(props) => `${Math.min(props.value, 100)}%`};
    background-color: ${Colors.primary};
    border-radius: ${borderRadius.full};
    transition: width 0.3s ease;
  }
`;

// Card
export const Card = styled.div`
  background: ${Colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  box-shadow: ${shadows.md};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.lg};
  }
`;

// Alert
export const Alert = styled.div<{ variant?: 'info' | 'success' | 'warning' | 'error' }>`
  padding: ${spacing.lg};
  border-radius: ${borderRadius.md};
  background-color: ${(props) => {
    switch (props.variant) {
      case 'success':
        return '#e8f5e9';
      case 'warning':
        return '#fff3e0';
      case 'error':
        return '#ffebee';
      default:
        return '#e3f2fd';
    }
  }};
  color: ${(props) => {
    switch (props.variant) {
      case 'success':
        return Colors.good;
      case 'warning':
        return Colors.warning;
      case 'error':
        return Colors.risk;
      default:
        return Colors.primary;
    }
  }};
  border-left: 4px solid
    ${(props) => {
      switch (props.variant) {
        case 'success':
          return Colors.good;
        case 'warning':
          return Colors.warning;
        case 'error':
          return Colors.risk;
        default:
          return Colors.primary;
      }
    }};
`;
