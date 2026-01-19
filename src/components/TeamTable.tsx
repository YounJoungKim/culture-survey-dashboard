import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Colors, spacing, borderRadius, shadows, getResponseRateColor } from '../utils/theme';
import { TeamStats } from '../types/index';

interface TeamTableProps {
  data: TeamStats[];
  title: string;
}

const Container = styled.div`
  background: ${Colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  box-shadow: ${shadows.sm};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${Colors.textMain};
  margin: 0;
`;

const SubTitle = styled.span`
  font-size: 13px;
  color: ${Colors.textSecondary};
  margin-left: ${spacing.sm};
`;

const SortButton = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  color: ${Colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: ${borderRadius.sm};

  &:hover {
    background-color: ${Colors.uiLight};
    color: ${Colors.primary};
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const Thead = styled.thead`
  position: sticky;
  top: 0;
  background: ${Colors.uiLight};
  z-index: 1;
`;

const Th = styled.th`
  padding: ${spacing.sm} ${spacing.md};
  text-align: left;
  font-weight: 600;
  color: ${Colors.textSecondary};
  border-bottom: 1px solid ${Colors.ui};
  white-space: nowrap;

  &:last-child {
    text-align: right;
  }
`;

const Tr = styled.tr`
  &:hover {
    background-color: ${Colors.uiLight};
  }
`;

const Td = styled.td`
  padding: ${spacing.sm} ${spacing.md};
  border-bottom: 1px solid ${Colors.ui};
  color: ${Colors.textMain};

  &:last-child {
    text-align: right;
  }
`;

const CompletedCell = styled.span`
  color: ${Colors.good};
  font-weight: 500;
`;

const IncompleteCell = styled.span`
  color: ${Colors.risk};
  font-weight: 500;
`;

const RateCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${spacing.sm};
`;

const ProgressBar = styled.div`
  width: 80px;
  height: 6px;
  background-color: ${Colors.uiLight};
  border-radius: 3px;
  overflow: hidden;
`;

const Progress = styled.div<{ width: number; color: string }>`
  width: ${(props) => props.width}%;
  height: 100%;
  background-color: ${(props) => props.color};
  border-radius: 3px;
`;

const RateValue = styled.span<{ color: string }>`
  font-weight: 600;
  color: ${(props) => props.color};
  min-width: 45px;
  text-align: right;
`;

const EmptyState = styled.div`
  padding: ${spacing.xl};
  text-align: center;
  color: ${Colors.textSecondary};
`;

const TeamTable: React.FC<TeamTableProps> = ({ data, title }) => {
  const [sortAsc, setSortAsc] = useState(true);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      return sortAsc ? a.수료율 - b.수료율 : b.수료율 - a.수료율;
    });
  }, [data, sortAsc]);

  const toggleSort = () => {
    setSortAsc(!sortAsc);
  };

  if (data.length === 0) {
    return (
      <Container>
        <Title>{title}</Title>
        <EmptyState>데이터가 없습니다.</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <div>
          <Title>{title}</Title>
          <SubTitle>응답률 기준 정렬 (클릭하여 변경)</SubTitle>
        </div>
        <SortButton onClick={toggleSort}>
          {sortAsc ? '낮은 순' : '높은 순'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {sortAsc ? (
              <path d="M12 5v14M5 12l7 7 7-7" />
            ) : (
              <path d="M12 19V5M5 12l7-7 7 7" />
            )}
          </svg>
        </SortButton>
      </Header>
      <TableWrapper>
        <Table>
          <Thead>
            <tr>
              <Th>본부</Th>
              <Th>팀</Th>
              <Th>총원</Th>
              <Th>수료</Th>
              <Th>미수료</Th>
              <Th>수료율</Th>
            </tr>
          </Thead>
          <tbody>
            {sortedData.map((row, index) => {
              const rateColor = getResponseRateColor(row.수료율);
              return (
                <Tr key={index}>
                  <Td>{row.소속1}</Td>
                  <Td>{row.팀}</Td>
                  <Td>{row.총원}명</Td>
                  <Td><CompletedCell>{row.수료}명</CompletedCell></Td>
                  <Td><IncompleteCell>{row.미수료}명</IncompleteCell></Td>
                  <Td>
                    <RateCell>
                      <ProgressBar>
                        <Progress width={row.수료율} color={rateColor} />
                      </ProgressBar>
                      <RateValue color={rateColor}>{row.수료율}%</RateValue>
                    </RateCell>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default TeamTable;
