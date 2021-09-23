import React, {useState} from 'react'
import {useFilters, usePagination, useRowSelect, useTable} from 'react-table'
import BTable from 'react-bootstrap/Table'
import {InputFilter} from "./ColumnFilters";
import PaginationButton from "./PaginitionButton";

const LOWEST_PAGE_SIZE = 10;

function Table({
                   columns,
                   tableData,
                   hiddenSelection,
                   onRowClick = () => {
                   },
                   onSelect,
                   onFilter,
                   rowStyle = () => {
                   },
                   pagination = false,
                   onDataChange = () => {
                   },
                   skipAutoRefresh = false,
               }) {

    const Checkbox = React.forwardRef(
        ({indeterminate, ...rest}, ref) => {
            const defaultRef = React.useRef()
            const resolvedRef = ref || defaultRef

            React.useEffect(() => {
                resolvedRef.current.indeterminate = indeterminate
            }, [resolvedRef, indeterminate])

            return (
                <>
                    <input type="checkbox" ref={resolvedRef} {...rest} />
                </>
            )
        }
    )

    const defaultColumn = React.useMemo(
        () => ({
            Filter: InputFilter(),
        }),
        []
    )

    const [skipRefresh, setSkipRefreh] = useState(false);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
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
        prepareRow,
        selectedFlatRows,
        state: {pageIndex, pageSize, filters}
    } = useTable(
        {
            columns,
            data: tableData,
            defaultColumn,
            onDataChange: (initialValue, value, row, column) => {
                setSkipRefreh(true);
                onDataChange(initialValue, value, row, column)
            },
            autoResetFilters: !(skipRefresh || skipAutoRefresh),
            autoResetSelectedRows: !(skipRefresh || skipAutoRefresh),
            initialState: {
                hiddenColumns: columns.map(column => {
                    if (column.hidden === true || (column.show !== undefined && !column.show)) return column.accessor || column.id;
                    return -1;
                })
            },
        },
        useFilters,
        usePagination,
        useRowSelect,
        hooks => {
            if (hiddenSelection !== true) {
                hooks.visibleColumns.push(columns => [
                    {
                        id: 'selection',
                        hidden: hiddenSelection,
                        Header: ({getToggleAllRowsSelectedProps}) => (
                            <div>
                                <Checkbox {...getToggleAllRowsSelectedProps()} />
                            </div>
                        ),
                        Cell: ({row}) => (
                            <div>
                                <Checkbox {...row.getToggleRowSelectedProps()} />
                            </div>
                        ),
                    },
                    ...columns,
                ])
            }
        }
    )

    /**
     * When selectedFlatRows array (array of row selected) length change, use onSelect callback function
     */
    React.useEffect(() => {
        onSelect(selectedFlatRows);
        // eslint-disable-next-line
    }, [selectedFlatRows.length]);
    /**
     * When when a filter is changed use the on filterCallback
     */
    React.useEffect(() => {
        if (onFilter instanceof Function) onFilter(rows);
        // eslint-disable-next-line
    }, [filters]);

    React.useEffect(() => {
        setSkipRefreh(false)
    }, [tableData]);

    return (
        <>
            <BTable striped bordered responsive {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}
                                <div>{column.canFilter ? column.render('Filter') : null}</div>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {(pagination ? page : rows).map((row) => {
                    prepareRow(row)
                    return (
                        <React.Fragment key={row.getRowProps().key}>
                            <tr onClick={() => onRowClick(row.values)} style={{backgroundColor: rowStyle(row.values)}}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}
                                            style={(cell.column.style instanceof Function ? cell.column.style(cell) : cell.column.style)}>{cell.render('Cell')}</td>
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