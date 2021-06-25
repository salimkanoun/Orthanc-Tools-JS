import ActionBouton from "../ActionBouton";
import LabelDropdown from "../../../OrthancContent/LabelDropdown";
import apis from "../../../../services/apis";
import React from "react";

const EditableCell = ({
                          value: initialValue,
                          row: {values},
                          column: {id, accessor},
                          onDataChange, // This is a custom function that we supplied to our table instance
                      }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)

    const onChange = e => {
        setValue(e.target.value)
    }

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        if (onDataChange) onDataChange(initialValue, value, values, id || accessor)
    }

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return <input value={value} onChange={onChange} onBlur={onBlur}/>
}

const columnSeriesFactory = (hiddenActionBouton, hiddenRemoveRow, onDelete, refresh) => [
    {
        accessor: 'SeriesOrthancID',
        show: false,
    }, {
        accessor: 'SeriesDescription',
        Header: 'Series Description',
        sort: true,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }, {
        accessor: 'Modality',
        Header: 'Modality',
        sort: true
    }, {
        accessor: 'Instances',
        Header: 'Instances',
        sort: true
    }, {
        accessor: 'SeriesNumber',
        Header: 'Series Number',
        sort: true
    }, {
        accessor: 'Action',
        Header: 'Action',
        show: !hiddenActionBouton,
        Cell: ({row}) => <ActionBouton level='series' orthancID={row.values.SeriesOrthancID}
                                       parentID={row.values.StudyID} onDelete={onDelete}
                                       row={row} refresh={refresh}
                                       hiddenMetadata={false} hiddenCreateDicom={true}/>
    }, {
        accessor: 'Remove',
        Header: 'Remove',
        show: !hiddenRemoveRow,
        Cell: ({row}) => {
            return <button type="button" className="btn btn-danger" onClick={(e) => {
                e.stopPropagation();
                onDelete(row.values.SeriesOrthancID)
            }}>Remove</button>
        }
    }
]

const columnStudyFactory = (hiddenActionBouton, hiddenRemoveRow, hiddenAccessionNumber, hiddenName, hiddenID, onDelete, refresh, showEditable = false, hiddenAnonymized = true) => [
    {
        accessor: 'StudyOrthancID',
        Header: 'Study Orthanc ID',
        show: false
    }, {
        accessor: 'StudyInstanceUID',
        Header: 'StudyInstanceUID',
        show: false
    }, {
        accessor: 'AnonymizedFrom',
        Header: 'AnonymizedFrom',
        show: false
    }, {
        accessor: 'PatientName',
        Header: 'Patient Name',
        sort: true,
        show: !hiddenName,
        editable: false,
    }, {
        accessor: 'PatientID',
        Header: 'Patient ID',
        sort: true,
        show: !hiddenID,
        editable: false,
    }, {
        accessor: 'StudyDate',
        Header: 'Study Date',
        sort: true,
        editable: false
    }, {
        accessor: 'StudyDescription',
        Header: 'Description',
        sort: true,
        title: (cell, row, rowIndex, colIndex) => row.values.StudyDescription,
        editable: false,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }, {
        accessor: 'newStudyDescription',
        Header: 'New Description',
        show: showEditable,
        Cell: EditableCell,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }, {
        accessor: 'AccessionNumber',
        Header: 'Accession Number',
        sort: true,
        show: !hiddenAccessionNumber,
        editable: false
    }, {
        accessor: 'newAccessionNumber',
        Header: 'New Accession Number',
        show: showEditable,
        Cell: EditableCell,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }, {
        accessor: 'Action',
        Header: 'Action',
        show: !hiddenActionBouton,
        Cell: (({row}) =>
                (<>
                    <ActionBouton level='studies' orthancID={row.values.StudyOrthancID}
                                  StudyInstanceUID={row.values.StudyInstanceUID} onDelete={onDelete} row={row}
                                  refresh={refresh}/>
                    <LabelDropdown selectedStudiesGetter={async () => {
                        let study = await apis.content.getStudiesDetails(row.values.StudyOrthancID)
                        return ([{
                            ID: row.values.StudyOrthancID,
                            MainDicomTags: {
                                StudyInstanceUID: row.values.StudyInstanceUID,
                            },
                            PatientMainDicomTags: {
                                PatientID: row.values.PatientID
                            },
                            ParentPatient: study.ParentPatient
                        }])
                    }}/>
                </>)
        ),
        editable: false,
        csvExport: false
    }, {
        accessor: 'Remove',
        Header: 'Remove',
        show: !hiddenRemoveRow,
        Cell: ({row}) => {
            return <button type="button" className="btn btn-danger" onClick={(e) => {
                e.stopPropagation();
                onDelete(row.values.StudyOrthancID)
            }}>Remove</button>
        },
        editable: false,
        csvExport: false
    }, {
        accessor: 'Anonymized',
        Header: 'Anonymized ?',
        style: (row) => {
            return {"color": row.values.AnonymizedFrom ? 'lightgreen' : 'orangered'}
        },
        classes: 'text-center',
        Cell: ({row}) => {
            return row.values.AnonymizedFrom ? 'Yes' : 'No'
        },
        show: !hiddenAnonymized,
        csvExport: false
    }]

const columnPatientsFactory = (hiddenActionBouton, hiddenRemoveRow, onDelete, onModify, refresh, showEditable = false,
                               textNameColumn = 'Patient Name', textIDColumn = 'Patient ID') => [
    {
        accessor: 'PatientOrthancID',
        show: false
    }, {
        accessor: 'PatientName',
        Header: textNameColumn,
        sort: true,
        editable: false,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }, {
        accessor: 'PatientID',
        Header: textIDColumn,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }, {
        accessor: 'newPatientName',
        Header: 'New Name',
        show: showEditable,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'},
        Cell: EditableCell
    }, {
        accessor: 'newPatientID',
        Header: 'New ID',
        show: showEditable,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'},
        Cell: EditableCell
    }, {
        accessor: 'Action',
        Header: 'Action',
        show: !hiddenActionBouton,
        Cell: ({row}) => {
            return <ActionBouton level='patients' orthancID={row.values.PatientOrthancID} onDelete={onDelete}
                                 onModify={onModify} row={row} refresh={refresh}/>
        }
    }, {
        accessor: 'Remove',
        Header: 'Remove',
        show: !hiddenRemoveRow,
        Cell: ({row}) => {
            return <button type="button" className="btn btn-danger" onClick={(e) => {
                e.stopPropagation();
                onDelete(row.values.PatientOrthancID)
            }}>Remove</button>
        },
        editable: false
    }]


export {columnStudyFactory, columnPatientsFactory, columnSeriesFactory}