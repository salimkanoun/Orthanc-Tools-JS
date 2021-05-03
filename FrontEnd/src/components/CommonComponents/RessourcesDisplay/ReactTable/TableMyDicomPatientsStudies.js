import React from 'react'
import { useTable,useFilters,useRowSelect} from 'react-table'
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



function App({tableData,onRowClick,onCheckboxClick}) {
  
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
            <ActionBouton level='studies'   
              orthancID={row.cell.row.values.StudyOrthancID} 
              StudyInstanceUID={row.cell.row.values.StudyInstanceUID} 
              row={row.cell.row} 
              hiddenModify={true} 
              hiddenDelete={true} 
              hiddenCreateDicom={true} 
            />
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
    selectedFlatRows,
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
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps, selectedFlatRows }) => (
            <div>
            {console.log(selectedFlatRows)}
              <Checkbox {...getToggleAllRowsSelectedProps()} onClick={(e)=>{console.log(e);onCheckboxClick(selectedFlatRows)}}/>
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({row , selectedFlatRows}) => (
            <div>
              <Checkbox {...row.getToggleRowSelectedProps()} onClick={()=>{console.log(row);onCheckboxClick(selectedFlatRows)}}/>
            </div>
          ),
        },
        ...columns,
      ])
    }
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
                <tr onClick={()=>onRowClick(row.values)}>
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
      <pre>
        <code>
          {JSON.stringify(
            {
              'selectedFlatRows[].original': selectedFlatRows.map(
                d => d.original
              ),
            },
            null,
            2
          )}
        </code>
      </pre>

    </>
  )
}

export default App