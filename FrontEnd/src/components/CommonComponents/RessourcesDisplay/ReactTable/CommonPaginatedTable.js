import React from 'react'
import {useTable} from 'react-table'
import BTable from 'react-bootstrap/Table'
import {usePagination} from "@material-ui/lab";

const LOWEST_PAGE_SIZE = 10;

function Table({
                   columns, tableData, onDataChange, pagination, rowStyle = () => {
    }, rowEvents = {}
               }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page,
        nextPage,
        previousPage,
        setPageSize,
        visibleColumns,
    } = useTable({
            columns,
            data: tableData,
            onDataChange,
            initialState: {
                hiddenColumns: columns.map(column => {
                    if (column.hidden || (column.show !== undefined && !column.show)) return column.accessor || column.id;
                    return -1;
                })
            },

        },
        usePagination
    )

    // Render the UI for your table
    return (
        <>
            <BTable striped bordered responsive {...getTableProps()}>
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
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        // Use a React.Fragment here so the table markup is still valid
                        <React.Fragment key={row.getRowProps().key}>
                            <tr {...row.getRowProps()} {...Object.fromEntries(Object.entries(rowEvents).map(([key, value]) => [key, (e) => {
                                value(e, row.values)
                            }]))} style={rowStyle(row.values)}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    )
                                })}
                            </tr>
                        </React.Fragment>
                    )
                })}
                </tbody>
            </BTable>
            <br/>
        </>
    )
}

export default Table
