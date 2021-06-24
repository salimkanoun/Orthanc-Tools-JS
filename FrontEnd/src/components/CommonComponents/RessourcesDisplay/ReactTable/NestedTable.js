import React from 'react'
import {useExpanded, usePagination, useRowSelect, useTable} from 'react-table'
import Table from 'react-bootstrap/Table'
import {FormCheck} from "react-bootstrap"

const actions = {};
actions.resetSelectedRows = 'resetSelectedRows'
actions.toggleAllRowsSelected = 'toggleAllRowsSelected'
actions.toggleRowSelected = 'toggleRowSelected'
actions.toggleAllPageRowsSelected = 'toggleAllPageRowsSelected'

function NestedTable({columns, data, setSelected, hiddenSelect}) {
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
            hooks.stateReducers.push((state, action, previousState, instance) => {
                    if (action.type === actions.resetSelectedRows ||
                        action.type === actions.toggleAllRowsSelected ||
                        action.type === actions.toggleRowSelected) {
                    }
                    instance.selectChange = true;
                    return state;
                }
            )
            hooks.useInstance.push((instance) => {
                if (instance.selectChange) setSelected({root: instance.selectedFlatRows.map(x => x.values)});
                instance.selectChange = false;
            })
        })
    return (
        <Table striped bordered responsive {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
                    <React.Fragment {...row.getRowProps()}>
                        <tr>
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
                                                        setSelected={(selected) => {
                                                            let t = [];
                                                            t[index] = selected;
                                                            setSelected({sub: t})
                                                        }}
                                                        hiddenSelect={hiddenSelect}
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
            {(10 < data.length ? <tr>
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
