import React from 'react'
import { useTable, useExpanded } from 'react-table'
import ActionBouton from '../ActionBouton'
import BTable from 'react-bootstrap/Table'
import ReactTableTest from './ReactTableTest'
    

// A simple way to support a renderRowSubComponent is to make a render prop
// This is NOT part of the React Table API, it's merely a rendering
// option we are creating for ourselves in our table renderer
function Table({ columns: userColumns, data, renderRowSubComponent }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    state: { expanded },
  } = useTable(
    {
      columns: userColumns,
      data,
      initialState: {
        hiddenColumns: userColumns.map(column => {
            if (column.show === false) return column.accessor || column.id;
        })
    },},
    useExpanded // We can useExpanded to track the expanded state
    // for sub components too!
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
                {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
                {row.isExpanded ? (
                  <tr>
                    <td colSpan={visibleColumns.length}>
                      {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                      {renderRowSubComponent({ row })}
                    </td>
                  </tr>
                ) : null}
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
        accessor: 'PatientID'
      },
      {
        Header :'Patient Name',
        accessor:'PatientName'
      },
      {
        Header: 'Study Date',
        accessor:'StudyDate',
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? '⬇'+row.StudyDate : '➡'+row.StudyDate}
          </span>
        ),
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

  const data = React.useMemo(() => [1],[])

  // Create a function that will render our row sub components
  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <div>
        <ReactTableTest data={row}/>
      </div>
    ),
    []
  )

  return (
      <Table
        columns={columns}
        data={data}
        // We added this as a prop for our table component
        // Remember, this is not part of the React Table API,
        // it's merely a rendering option we created for
        // ourselves
        renderRowSubComponent={renderRowSubComponent}
      />
  )
}

export default App
