import React from 'react'
import {useExpanded, useFilters, usePagination, useRowSelect, useSortBy, useTable} from 'react-table'
import Table from 'react-bootstrap/Table'
import {FormCheck} from "react-bootstrap"

const actions = {};
actions.resetSelectedRows = 'resetSelectedRows'
actions.toggleAllRowsSelected = 'toggleAllRowsSelected'
actions.toggleRowSelected = 'toggleRowSelected'
actions.toggleAllPageRowsSelected = 'toggleAllPageRowsSelected'

const LOWEST_PAGE_SIZE = 10;

function NestedTable({columns, data, setSelected, hiddenSelect, rowEvent, rowStyle, filtered = false, sorted = false}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        setPageSize,
        prepareRow,
        visibleColumns,
        selectedFlatRows,
        state: {expanded, pageIndex, pageSize, selectedRowIds}
    } = useTable(
        {
            columns,
            data,
            initialState: {
                hiddenColumns: columns.map(column => {
                    if (column.show === false || column.table instanceof Array) return column.accessor || column.id;
                }),
                pageIndex: 0,
                pageSize: 10
            },
        },
        (filtered ? useFilters : () => {
        }),
        (sorted ? useSortBy : () => {
        }),
        useExpanded,
        usePagination,
        useRowSelect,
        hooks => {
            if (!hiddenSelect) hooks.visibleColumns.push(columns => [{
                id: 'selection',
                Header: ({getToggleAllRowsSelectedProps}) => (
                    <div>
                        <FormCheck {...getToggleAllRowsSelectedProps()} />
                    </div>
                ),
                Cell: ({row}) => (
                    <div>
                        <FormCheck {...row.getToggleRowSelectedProps()} />
                    </div>
                ),
            },
                ...columns,
            ])
            if (columns.filter(column => column.table instanceof Array).length > 0) hooks.visibleColumns.push(columns => [
                {
                    id: 'expanded',
                    Header: '',
                    Cell: ({row}) => (
                        <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? '⬇' : '➡'}
                        </span>
                    ),
                },
                ...columns,
            ])
        })

    React.useEffect(() => {
        if (!!setSelected) setSelected({root: selectedFlatRows.map(x => x.values)});
        // eslint-disable-next-line
    }, [selectedFlatRows.length]);


    return (
        <Table striped bordered responsive {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()} >
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps(sorted ? column.getSortByToggleProps() : undefined)}>
                            {column.render('Header')}
                            {!!column.Filter && filtered ? column.render('Filter') : null}
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
                //debugger;
                prepareRow(row)
                return (
                    // Use a React.Fragment here so the table markup is still valid
                    <React.Fragment>
                        <tr {...row.getRowProps()} onClick={((event) => {
                            if (rowEvent) rowEvent(row.values);
                        })} style={(rowStyle ? rowStyle(row.values) : null)}>
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                )
                            })}
                        </tr>
                        {row.isExpanded ? (Object.entries(row.values).map(([key, value], index) => {
                                    let matchingColumn = columns.filter(column => !!column.table && column.accessor === key)[0];
                                    return (!!matchingColumn > 0 ?
                                            <tr>
                                                <td className={"subtable-row"} colSpan={visibleColumns.length}>
                                                    <NestedTable
                                                        columns={matchingColumn.table}
                                                        data={value || []}
                                                        setSelected={!!setSelected ? (selected) => {
                                                            let t = [];
                                                            t[index] = selected;
                                                            setSelected({sub: t})
                                                        } : undefined}
                                                        hiddenSelect={hiddenSelect}
                                                        rowEvent={rowEvent}
                                                        rowStyle={rowStyle}
                                                    />
                                                </td>
                                            </tr> :
                                            null
                                    )
                                }
                            )
                        ) : null}
                    </React.Fragment>
                )
            })}
            {(LOWEST_PAGE_SIZE < data.length ? <tr>
                <td colSpan={visibleColumns.length}>
                    <div className={'d-flex justify-content-between'}>
                        <button disabled={pageIndex === 0} className={'btn btn-primary'}
                                onClick={previousPage}>⇦
                        </button>
                        <select className="form-select" aria-label="Default select example"
                                onChange={(page) => {
                                    setPageSize(page.target.value)
                                }}>
                            <option selected value="10">10</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                        </select>
                        <button disabled={pageIndex * pageSize + pageSize > data.length}
                                className={'btn btn-primary '}
                                onClick={nextPage}>⇨
                        </button>
                    </div>
                </td>
            </tr> : null)}
            </tbody>
        </Table>
    )
}

export default NestedTable
