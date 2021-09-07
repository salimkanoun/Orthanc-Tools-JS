import React, {useState} from 'react'
import {usePagination, useTable} from 'react-table'
import BTable from 'react-bootstrap/Table'
import PaginationButton from "./PaginitionButton"

const LOWEST_PAGE_SIZE = 10;

function Table({
                   columns, tableData, onDataChange, pagination, rowStyle = () => {
    }, rowEvents = {}
               }) {
    const [skipPageReset, setSkipPageReset] = useState(false);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        visibleColumns,
        state: {pageIndex, pageSize}
    } = useTable({
            columns,
            data: tableData,
            onDataChange: (oldValue, newValue, row, column) => {
                setSkipPageReset(true);
                onDataChange(oldValue, newValue, row, column)
            },
            autoResetPage: !skipPageReset,
            initialState: {
                hiddenColumns: columns.map(column => {
                    if (column.hidden || (column.show !== undefined && !column.show)) return column.accessor || column.id;
                    return -1;
                })
            },

        },
        usePagination
    )

    React.useEffect(() => {
        setSkipPageReset(false)
    }, [tableData])
    // Render the UI for your table
    return (
        <>
            <BTable striped bordered responsive {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr className="text-center" {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {(pagination ? page : rows).map((row, i) => {
                    prepareRow(row)
                    return (
                        // Use a React.Fragment here so the table markup is still valid
                        <React.Fragment key={row.getRowProps().key}>
                            <tr {...row.getRowProps()} {...Object.fromEntries(Object.entries(rowEvents).map(([key, value]) => [key, (e) => {
                                value(e, row.values)
                            }]))} style={rowStyle(row.values)}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}
                                            style={(cell.column.style instanceof Function ? cell.column.style(row) : cell.column.style)}>{cell.render('Cell')}</td>
                                    )
                                })}
                            </tr>
                        </React.Fragment>
                    )
                })}
                {(pagination && LOWEST_PAGE_SIZE < tableData.length ?
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
                                    rowsCount={tableData.length}/>
                            </div>
                        </td>
                    </tr> : null)}
                </tbody>
            </BTable>
            <br/>
        </>
    )
}

export default Table
