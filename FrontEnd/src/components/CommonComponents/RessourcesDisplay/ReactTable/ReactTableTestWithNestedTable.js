import React from 'react'
import {useExpanded, useTable} from 'react-table'
import ActionBouton from '../ActionBouton'
import BTable from 'react-bootstrap/Table'
import ReactTableTest from './ReactTableTest'

function Table({columns: userColumns, data, renderRowSubComponent}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        visibleColumns,
        state: {expanded},
    } = useTable(
        {
            columns: userColumns,
            data,
            initialState: {
                hiddenColumns: userColumns.map(column => {
                    if (column.show === false) return column.accessor || column.id;
                })
            },
        },
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
                            {row.isExpanded ? (
                                <tr>
                                    <td colSpan={visibleColumns.length}>
                                        {renderRowSubComponent({row})}
                                    </td>
                                </tr>
                            ) : null}
                        </React.Fragment>
                    )
                })}
                </tbody>
            </BTable>
            <br/>
        </>
    )
}

function App() {
    const columns = React.useMemo(
        () => [
            {
                Header: '',
                accessor: 'extended',
                Cell: ({row}) => (
                    // Use Cell to render an expander for each row.
                    // We can use the getToggleRowExpandedProps prop-getter
                    // to build the expander.
                    <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? '⬇' : '➡'}
          </span>
                ),
            },
            {
                Header: 'Study Orthanc ID',
                accessor: 'StudyOrthancID',
                show: false
            },
            {
                Header: 'Study Instance UID',
                accessor: 'StudyInstanceUID',
                show: false
            },
            {
                Header: 'Patient ID',
                accessor: 'PatientID'
            },
            {
                Header: 'Patient Name',
                accessor: 'PatientName'
            },
            {
                Header: 'Study Date',
                accessor: 'StudyDate'
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
                Cell: (row) => {
                    return (
                        <span>
            <ActionBouton level='studies' orthancID={row.StudyOrthancID} StudyInstanceUID={row.StudyInstanceUID}
                          row={row}/>
          </span>
                    )
                }
            },
        ],
        []
    )

    const data = React.useMemo(() => [1], [])

    // Create a function that will render our row sub components
    const renderRowSubComponent = React.useCallback(
        ({row}) => (
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
            renderRowSubComponent={renderRowSubComponent}
        />
    )
}

export default App
