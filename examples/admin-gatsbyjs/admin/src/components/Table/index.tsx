import React from 'react';
import styled from 'styled-components';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import {
  breakpointDown,
  Button,
  Card,
  CardBody,
  Col,
  EvaIcon,
  InputGroup,
  Row,
  Spinner,
  Tooltip,
  Popover,
} from 'oah-ui';
import { columns } from './Columns';
import { initPages } from './utils';
import { SchemaModel } from '@prisma-tools/admin';

interface TableProps {
  model?: SchemaModel | null;
  data: any[];
  fetchMore: (pageSize: number, pageIndex: number) => void;
  loading: boolean;
  pageCount: number;
  initialFilter: { id: string; value: any }[];
  sortByHandler: (sortBy: { id: string; desc: boolean }[]) => void;
  filterHandler: (filters: { id: string; value: any }[]) => void;
  onAction: (action: 'create' | 'update' | 'delete', id?: number) => void;
}

export const Table: React.FC<TableProps> = ({
  initialFilter,
  model,
  data,
  fetchMore,
  loading,
  pageCount: controlledPageCount,
  sortByHandler,
  filterHandler,
  onAction,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, filters, sortBy },
  } = useTable(
    {
      columns: columns(model),
      data,
      initialState: { pageIndex: 0, filters: initialFilter }, // Pass our hoisted table state
      manualFilters: true,
      manualSortBy: true,
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    fetchMore(pageSize, pageIndex);
  }, [fetchMore, pageIndex, pageSize]);

  React.useEffect(() => {
    sortByHandler(sortBy);
  }, [sortBy]);

  React.useEffect(() => {
    filterHandler(filters);
  }, [filters]);

  const actions = {
    create: model?.create,
    update: model?.update,
    delete: model?.delete,
  };
  const hasActions = actions.create || actions.update || actions.delete;
  // Render the UI for your table
  return (
    <Card status="Primary">
      <header>{model?.name}</header>
      <CardBody id="popoverScroll">
        {loading && <Spinner size="Giant" />}
        <StyledTable {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup: any, index: number) => (
              <React.Fragment key={index}>
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {hasActions && <th colSpan={2}>Actions</th>}
                  {headerGroup.headers.map((column: any, index2: number) => (
                    <th key={index2} {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                    </th>
                  ))}
                </tr>
                <tr>
                  {hasActions && (
                    <th colSpan={2}>
                      {actions.create && (
                        <Button onClick={() => onAction('create')} size="Tiny">
                          <EvaIcon name="plus-outline" />
                        </Button>
                      )}
                    </th>
                  )}
                  {headerGroup.headers.map((column: any, index: number) => (
                    <th key={index}>
                      <div>{column.canFilter ? column.render('Filter') : null}</div>
                    </th>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row: any, index: number) => {
              prepareRow(row);
              return (
                <tr key={index} {...row.getRowProps()}>
                  {actions.update && (
                    <td colSpan={actions.delete ? 1 : 2}>
                      <Tooltip
                        className="inline-block"
                        status="Primary"
                        trigger="hint"
                        placement="top"
                        content="Edit Row"
                      >
                        <Button
                          style={{ padding: 0 }}
                          appearance="ghost"
                          onClick={() => onAction('update', row.original.id)}
                        >
                          <EvaIcon name="edit-outline" />
                        </Button>
                      </Tooltip>
                    </td>
                  )}
                  {actions.delete && (
                    <td colSpan={actions.update ? 1 : 2}>
                      <Tooltip
                        className="inline-block"
                        status="Danger"
                        trigger="hint"
                        placement="top"
                        content="Delete Row"
                      >
                        <Button
                          style={{ padding: 0 }}
                          status="Danger"
                          appearance="ghost"
                          onClick={() => onAction('delete', row.original.id)}
                        >
                          <EvaIcon name="trash-2-outline" />
                        </Button>
                      </Tooltip>
                    </td>
                  )}
                  {actions.create && !actions.update && !actions.delete && <td colSpan={2} />}
                  {row.cells.map((cell: any, index2: number) => {
                    return (
                      <td key={index2} {...cell.getCellProps()}>
                        {cell.value && cell.value.length > 15 ? (
                          <Popover
                            eventListener="#popoverScroll"
                            trigger="hover"
                            placement="top"
                            overlay={
                              <Card style={{ marginBottom: '0', maxHeight: '300px' }}>
                                <CardBody>
                                  <div style={{ maxWidth: '300px' }} dangerouslySetInnerHTML={{ __html: cell.value }} />
                                </CardBody>
                              </Card>
                            }
                          >
                            {cell.render('Cell')}
                          </Popover>
                        ) : (
                          cell.render('Cell')
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr>
              <td colSpan={10000}>
                Showing {page.length} of ~{controlledPageCount * pageSize} results
              </td>
            </tr>
          </tbody>
        </StyledTable>
      </CardBody>
      <footer>
        <StyledRow middle="xs">
          <Col breakPoint={{ md: 12, lg: 4 }}>
            <Tooltip
              className="inline-block"
              status="Primary"
              trigger="hint"
              placement="top"
              content="Go to first page"
            >
              <StyledButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                <EvaIcon name="arrowhead-left-outline" />
              </StyledButton>
            </Tooltip>
            <StyledButton onClick={() => previousPage()} disabled={!canPreviousPage}>
              <EvaIcon name="arrow-ios-back" />
            </StyledButton>
            {initPages(pageCount, pageIndex + 1).map((item) => (
              <StyledButton
                key={item}
                onClick={() => gotoPage(item - 1)}
                status={item === pageIndex + 1 ? 'Primary' : 'Basic'}
              >
                {item}
              </StyledButton>
            ))}
            <StyledButton onClick={() => nextPage()} disabled={!canNextPage}>
              <EvaIcon name="arrow-ios-forward" />
            </StyledButton>
            <Tooltip className="inline-block" status="Primary" trigger="hint" placement="top" content="Go to last page">
              <StyledButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                <EvaIcon name="arrowhead-right-outline" />
              </StyledButton>
            </Tooltip>
          </Col>
          <Col breakPoint={{ md: 12, lg: 4 }}>
            <InputGroup size="Small" style={{ justifyContent: 'center' }}>
              <input
                placeholder="Go Page Number"
                type="number"
                value={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
              />
            </InputGroup>
          </Col>
          <Col breakPoint={{ md: 12, lg: 4 }}>
            {[10, 20, 30, 40, 50, 100].map((item) => (
              <Tooltip
                key={item}
                className="inline-block"
                status="Primary"
                trigger="hint"
                placement="top"
                content={'Set page size ' + item}
              >
                <StyledButton onClick={() => setPageSize(item)} status={item === pageSize ? 'Primary' : 'Basic'}>
                  {item}
                </StyledButton>
              </Tooltip>
            ))}
          </Col>
        </StyledRow>
      </footer>
    </Card>
  );
};

const StyledTable = styled.table`
  border-spacing: 0;
  tbody tr:nth-child(2n) {
    background-color: ${(props) => props.theme.backgroundBasicColor2};
  }
  tbody tr:hover {
    background: ${(props) => props.theme.backgroundBasicColor3} !important;
  }

  thead tr {
    background: ${(props) => props.theme.backgroundBasicColor2};
    th {
      border-top: 1px solid ${(props) => props.theme.backgroundBasicColor3};
      border-left: 1px solid ${(props) => props.theme.backgroundBasicColor3};
      :last-child {
        border-right: 1px solid ${(props) => props.theme.backgroundBasicColor3};
      }
    }
  }

  tr {
    :last-child {
      td {
        text-align: start;
        border: 1px solid ${(props) => props.theme.backgroundBasicColor2};
      }
    }
  }

  td,
  td div {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 150px;
  }

  th,
  td {
    margin: 0;
    padding: 0.5rem;
    border-top: 1px solid ${(props) => props.theme.backgroundBasicColor2};
    border-left: 1px solid ${(props) => props.theme.backgroundBasicColor2};
    text-align: center;
    :last-child {
      border-right: 1px solid ${(props) => props.theme.backgroundBasicColor2};
    }
  }
`;

const StyledButton = styled(Button)`
  margin-right: 5px;
  padding: 0.3rem;
`;

const StyledRow = styled(Row)`
  text-align: center;
  ${breakpointDown('md')`
    & > :not(:last-child) {
      margin-bottom: 20px;
    }
  `}
`;