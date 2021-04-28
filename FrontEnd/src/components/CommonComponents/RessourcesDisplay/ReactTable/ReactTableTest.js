import React from 'react'
import { useTable} from 'react-table'
import ActionBouton from '../ActionBouton'
import BTable from 'react-bootstrap/Table'
    

// A simple way to support a renderRowSubComponent is to make a render prop
// This is NOT part of the React Table API, it's merely a rendering
// option we are creating for ourselves in our table renderer
function Table({ columns: userColumns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns: userColumns,
      data,
    },
  )

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
              <React.Fragment {...row.getRowProps()}>
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

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Study Date',
        accessor:'StudyDate',
      },
      {
        Header: 'Description',
        accessor: 'StudyDescription'
      },
      {
        Header: 'Accession number',
        accessor: 'AccessionNumber'
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell:(row)=>{
          return(
          <span>
            <ActionBouton level='studies' orthancID={row.StudyOrthancID} StudyInstanceUID={row.StudyInstanceUID} row={row} />
          </span>
          )
        }
      },
    ],
    []
  )

  const data = React.useMemo(() => [1], [])

  return (
      <Table
        columns={columns}
        data={data}
      />
  )
}

export default App
