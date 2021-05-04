import React from 'react'
import { useTable} from 'react-table'
import ActionBouton from '../ActionBouton'
import BTable from 'react-bootstrap/Table'
    

// A simple way to support a renderRowSubComponent is to make a render prop
// This is NOT part of the React Table API, it's merely a rendering
// option we are creating for ourselves in our table renderer
function App({tableData}) {
  const columns = React.useMemo(
    () => [
      {
        accessor:'StudyOrthancID',
        show : false,
      },
      {
        Header: 'Series Description',
        accessor: 'SeriesDescription',
      },
      {
        Header :'Modality',
        accessor:'Modality'
      },
      {
        Header:'Instances',
        accessor:'Instances'
      },
      {
        Header: 'Series Number',
        accessor:'SeriesNumber',
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
            <ActionBouton level='series' 
              orthancID={row.row.values.StudyOrthancID} 
              row={row.row} 
              hiddenModify={true} 
              hiddenDelete={true} 
              hiddenMetadata={false} 
              hiddenCreateDicom={true}/>
          </span>
          )
        }
      },
    ],
    []
  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data:tableData,
      initialState: {
        hiddenColumns: columns.map(column => {
            if (column.show === false) return column.accessor || column.id;
        })
    },},
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

export default App