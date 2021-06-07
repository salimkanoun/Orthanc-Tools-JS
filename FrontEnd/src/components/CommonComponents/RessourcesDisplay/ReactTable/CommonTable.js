import React from 'react'
import { useTable } from 'react-table'
import BTable from 'react-bootstrap/Table'

function Table({ columns, tableData }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data:tableData,
    initialState: {
      hiddenColumns: columns.map(column => {
          if (column.hidden === true) return column.accessor || column.id;
          return -1;
      })
     },
  })

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
                <tr>
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
      <br />
    </>
  )
}

export default Table
