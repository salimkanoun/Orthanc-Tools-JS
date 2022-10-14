import React from 'react'
import { usePagination, useTable, useSortBy, useRowSelect } from 'react-table'
import BTable from 'react-bootstrap/Table'
import PaginationButton from "./PaginitionButton"
import { FormCheck } from 'react-bootstrap';

const LOWEST_PAGE_SIZE = 10;

function CommonTable({
    getRowId = undefined, 
    columns, 
    data, 
    pagination = false, 
    selectable = false, 
    onRowClick = () => { }, 
    rowStyle = () => { }, 
    onSelectRow = () => {}
}) {

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
        selectedFlatRows,
        state: { pageIndex, pageSize }
    } = useTable({
        getRowId,
        columns,
        data: data,
        initialState: {
            hiddenColumns: columns.map(column => {
                if (column.hidden || (column.show !== undefined && !column.show)) return column.accessor || column.id;
                return -1;
            })
        },

    },
        useSortBy,
        usePagination,
        useRowSelect,
        hooks => {
            if (selectable) hooks.visibleColumns.push(columns => [{
                id: 'selection',
                Header: ({ getToggleAllRowsSelectedProps }) => (
                    <div>
                        <FormCheck {...getToggleAllRowsSelectedProps()} />
                    </div>
                ),
                Cell: ({ row }) => (
                    <div>
                        <FormCheck {...row.getToggleRowSelectedProps()} />
                    </div>
                ),
            },
            ...columns,
            ])
        }
    )

    React.useEffect(() => {
        if (!!onSelectRow) onSelectRow( selectedFlatRows.map(row => row.original) );
        // eslint-disable-next-line
    }, [selectedFlatRows.length]);

    // Render the UI for your table
    return (
        <>
            <BTable striped bordered responsive {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr className="text-center" {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                </th>
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
                                <tr {...row.getRowProps()} onClick={() => onRowClick(row.id)} style={rowStyle(row.id)}>
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
                    {(pagination && LOWEST_PAGE_SIZE < data.length ?
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
                                        rowsCount={data.length} />
                                </div>
                            </td>
                        </tr> : null)}
                </tbody>
            </BTable>
            <br />
        </>
    )
}

export default CommonTable