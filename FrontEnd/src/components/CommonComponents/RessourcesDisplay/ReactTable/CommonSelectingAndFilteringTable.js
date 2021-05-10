import React from 'react'
import { useTable,useFilters,useRowSelect} from 'react-table'
import BTable from 'react-bootstrap/Table'
import ColumnFilter from './ColumnFilter'

function Table({columns,tableData,hiddenSelection,onRowClick,onSelect,rowStyle}) {
  
  const Checkbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
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
      Filter: ColumnFilter,
    }),
    []
  )


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows
  } = useTable(
    {
      columns,
      data:tableData,
      defaultColumn,
      initialState: {
        hiddenColumns: columns.map(column => {
            if (column.hidden === true) return column.accessor || column.id;
            return -1;
        })
    },},
    useFilters,
    useRowSelect,
    hooks => {if(hiddenSelection!==true){
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          hidden:hiddenSelection,
          Header: ({ getToggleAllRowsSelectedProps }) => (
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
    }}
  )

  React.useEffect(() => { 
          onSelect(selectedFlatRows);
          // eslint-disable-next-line react-hooks/exhaustive-deps
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
          {rows.map((row) => {
            prepareRow(row)
            return (
              <React.Fragment key={row.getRowProps().key} > 
                <tr onClick={()=>onRowClick(row.values)} style={{backgroundColor:rowStyle(row.values)}}>
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