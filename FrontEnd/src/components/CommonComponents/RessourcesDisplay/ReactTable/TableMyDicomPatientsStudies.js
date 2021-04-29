import React from 'react'
import { useTable,useFilters} from 'react-table'
import ActionBouton from '../ActionBouton'
import BTable from 'react-bootstrap/Table'

function ColumnFilter({
  column: { filterValue, setFilter },
}) {
  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value.replace(' ','') || undefined) // Set undefined to remove the filter entirely
      }}
    />
  )
}


function App({tableData},rowEventStudies) {

  const defaultColumn = React.useMemo(
    () => ({
      Filter: ColumnFilter,
    }),
    []
  )  

  const columns = React.useMemo(
    () => [
      {
        Header: 'Study Orthanc ID',
        accessor : 'StudyOrthancID',
        show:false
      },
      {
        Header: 'Study Instance UID',
        accessor:'StudyInstanceUID',
        show:false
      },
      {
        Header: 'Patient ID',
        accessor: 'PatientID',
      },
      {
        Header :'Patient Name',
        accessor:'PatientName',
      },
      {
        Header: 'Study Date',
        accessor:'StudyDate',
        disableFilters:true
      },
      {
        Header: 'Description',
        accessor: 'StudyDescription',
        disableFilters:true
      },
      {
        Header: 'Accession number',
        accessor: 'AccessionNumber',
        disableFilters:true
      },
      {
        Header: 'Action',
        Cell:(row)=>{
          return(
          <span>
            <ActionBouton level='studies' orthancID={row.cell.row.values.StudyOrthancID} StudyInstanceUID={row.cell.row.values.StudyInstanceUID} row={row} />
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
      defaultColumn,
      initialState: {
        hiddenColumns: columns.map(column => {
            if (column.show === false) return column.accessor || column.id;
        })
    },},
    useFilters,
  )
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
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <React.Fragment key={row.getRowProps().key}>
                <tr onClick={() => console.log(row)}>
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