import React from 'react';
import styled from 'styled-components';
import { Colors, spacing, borderRadius, shadows } from '@utils/theme';

interface FilterButtonsProps {
  organizations: string[];
  selectedOrg: string;
  onOrgChange: (org: string) => void;
}

const FilterContainer = styled.div`
  background: ${Colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  margin-bottom: ${spacing.lg};
  box-shadow: ${shadows.md};
  display: flex;
  gap: ${spacing.md};
  flex-wrap: wrap;
  align-items: center;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: ${Colors.textMain};
  font-size: 14px;
  margin-right: ${spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.sm};
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ isActive: boolean }>`
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  border: 2px solid
    ${(props) => (props.isActive ? Colors.primary : Colors.ui)};
  background-color: ${(props) =>
    props.isActive ? Colors.primary : Colors.white};
  color: ${(props) => (props.isActive ? Colors.white : Colors.textMain)};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${Colors.primary};
    background-color: ${(props) =>
      props.isActive ? '#E67E00' : Colors.primaryLight};
    transform: translateY(-2px);
    box-shadow: ${shadows.sm};
  }

  &:active {
    transform: translateY(0);
  }
`;

const FilterButtons: React.FC<FilterButtonsProps> = ({
  organizations,
  selectedOrg,
  onOrgChange,
}) => {
  const filterOptions = ['전체', ...organizations];

  return (
    <FilterContainer>
      <FilterLabel>부서 필터</FilterLabel>
      <ButtonGroup>
        {filterOptions.map((org) => (
          <FilterButton
            key={org}
            isActive={selectedOrg === org}
            onClick={() => onOrgChange(org)}
          >
            {org}
          </FilterButton>
        ))}
      </ButtonGroup>
    </FilterContainer>
  );
};

export default FilterButtons;
