import React from 'react'
import {useFilters, usePagination, useRowSelect, useTable} from 'react-table'
import BTable from 'react-bootstrap/Table'
import {InputFilter} from "./ColumnFilters";

const LOWEST_PAGE_SIZE = 10;

function Table({
                   columns,
                   tableData,
                   hiddenSelection,
                   onRowClick = () => {
                   },
                   onSelect,
                   rowStyle = () => {
                   },
                   pagination = false,
                   onDataChange = () => {
                   }
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


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        page,
        nextPage,
        previousPage,
        setPageSize,
        visibleColumns,
        prepareRow,
        selectedFlatRows,
        state: {pageIndex, pageSize}
    } = useTable(
        {
            columns,
            data: tableData,
            defaultColumn,
            onDataChange,
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
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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