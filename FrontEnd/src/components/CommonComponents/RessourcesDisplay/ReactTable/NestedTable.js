import React, {useEffect, useState} from 'react'
import {useExpanded, useFilters, usePagination, useRowSelect, useSortBy, useTable} from 'react-table'
import Table from 'react-bootstrap/Table'
import {FormCheck} from "react-bootstrap"
import PaginationButton from "./PaginitionButton";

const actions = {};
actions.resetSelectedRows = 'resetSelectedRows'
actions.toggleAllRowsSelected = 'toggleAllRowsSelected'
actions.toggleRowSelected = 'toggleRowSelected'
actions.toggleAllPageRowsSelected = 'toggleAllPageRowsSelected'

const LOWEST_PAGE_SIZE = 10;


function SubRow({span, columns, data, setSelected, index, hiddenSelect, rowEvent, rowStyle}) {
    return <tr>
        <td className={"subtable-row"} colSpan={span}>
            <NestedTable
                columns={columns}
                data={data || []}
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
    </tr>;
}

function LazySubRow({span, columns, getter, setSelected, index, hiddenSelect, rowEvent, rowStyle}) {
    const [data, setData] = useState(null);
    useEffect(() => {
        getter().then(setData);
    }, [getter]);
    return (data != null ? <tr>
        <td className={"subtable-row"} colSpan={span}>
            <NestedTable
                columns={columns}
                data={data}
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
    </tr> : null);
}


function NestedTable({columns, data, setSelected, hiddenSelect, rowEvent, rowStyle, filtered = false, sorted = false}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        prepareRow,
        visibleColumns,
        selectedFlatRows,
        state: {pageIndex, pageSize}
    } = useTable(
        {
            columns,
            data,
            autoResetExpanded: false,
            initialState: {
                hiddenColumns: columns.map(column => {
                    if (column.show === false || column.table instanceof Array)
                        return column.accessor || column.id;
                    return null;
                }).filter(x => x != null),
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
                        <div
                            className={'d-flex justify-content-center expand-cell align-content-center'} {...row.getToggleRowExpandedProps()}>
                            <span>{row.isExpanded ? '⬇' : '➡'}</span>
                        </div>
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
            {page.map((row) => {
                prepareRow(row)
                return (
                    // Use a React.Fragment here so the table markup is still valid
                    <React.Fragment>
                        <tr {...row.getRowProps()} onClick={(() => {
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
                                    return (!!matchingColumn ?
                                            (!matchingColumn.lazy ?
                                                <SubRow span={visibleColumns.length}
                                                        columns={matchingColumn.table} data={value} index={index}
                                                        setSelected={setSelected}
                                                        hiddenSelect={hiddenSelect} rowEvent={rowEvent}
                                                        rowStyle={rowStyle
                                                        }/> :
                                                <LazySubRow span={visibleColumns.length}
                                                            columns={matchingColumn.table}
                                                            getter={value}
                                                            index={index}
                                                            setSelected={setSelected}
                                                            hiddenSelect={hiddenSelect}
                                                            rowEvent={rowEvent}
                                                            rowStyle={rowStyle
                                                            }/>) :
                                            null
                                    )
                                }
                            )
                        ) : null}
                    </React.Fragment>
                )
            })}
            {(LOWEST_PAGE_SIZE < data.length ?
                <tr>
                    <td colSpan={visibleColumns.length} aria-colspan={visibleColumns.length}>
                        <div className={'d-flex justify-content-end'}>
                            <PaginationButton
                                gotoPage={gotoPage}
                                previousPage={previousPage}
                                nextPage={nextPage}
                                canPreviousPage={canPreviousPage}
                                canNextPage={canNextPage}
                                pageIndex={pageIndex}
                                pageCount={pageCount}
                                pageOptions={pageOptions || []}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                rowsCount={data.length}/>
                        </div>
                    </td>
                </tr> : null)}
            </tbody>
        </Table>
    )
}

export default NestedTable
