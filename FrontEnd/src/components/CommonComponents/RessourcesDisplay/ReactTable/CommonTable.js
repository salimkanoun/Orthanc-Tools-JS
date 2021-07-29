import React, {useState} from 'react'
import {usePagination, useTable} from 'react-table'
import BTable from 'react-bootstrap/Table'

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
                    <tr {...headerGroup.getHeaderGroupProps()}>
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
                {(pagination && LOWEST_PAGE_SIZE < tableData.length ? <tr>
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
                            <button disabled={pageIndex * pageSize + pageSize > tableData.length}
                                    className={'btn btn-primary '}
                                    onClick={nextPage}>⇨
                            </button>
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
