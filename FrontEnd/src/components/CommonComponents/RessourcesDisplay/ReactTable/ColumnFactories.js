import ActionBouton from "../ActionBouton";
import LabelDropdown from "../../../OrthancContent/LabelDropdown";
import apis from "../../../../services/apis";
import React from "react";

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
        Cell: (row) => <ActionBouton level='series' orthancID={row.SeriesOrthancID}
                                     parentID={row.StudyID} onDelete={onDelete}
                                     row={row} refresh={refresh}
                                     hiddenMetadata={false} hiddenCreateDicom={true}/>
    }, {
        accessor: 'Remove',
        Header: 'Remove',
        show: !hiddenRemoveRow,
        Cell: (row) => {
            return <button type="button" className="btn btn-danger" onClick={(e) => {
                e.stopPropagation();
                onDelete(row.SeriesOrthancID)
            }}>Remove</button>
        }
    }
]

const columnStudyFactory = (hiddenActionBouton, hiddenRemoveRow, hiddenAccessionNumber, hiddenName, hiddenID, onDelete, refresh) => [
    {
        accessor: 'StudyOrthancID',
        Header: 'Study Orthanc ID',
        show: false
    }, {
        accessor: 'StudyInstanceUID',
        Header: 'StudyInstanceUID',
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
        title: (cell, row, rowIndex, colIndex) => row.StudyDescription,
        editable: false,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }, {
        accessor: 'AccessionNumber',
        Header: 'Accession Number',
        sort: true,
        show: !hiddenAccessionNumber,
        editable: false
    }, {
        accessor: 'Action',
        Header: 'Action',
        show: !hiddenActionBouton,
        Cell: ((row) =>
                (<>
                    <ActionBouton level='studies' orthancID={row.StudyOrthancID}
                                  StudyInstanceUID={row.StudyInstanceUID} onDelete={onDelete} row={row}
                                  refresh={refresh}/>
                    <LabelDropdown selectedStudiesGetter={async () => {
                        let study = await apis.content.getStudiesDetails(row.StudyOrthancID)
                        return ([{
                            ID: row.StudyOrthancID,
                            MainDicomTags: {
                                StudyInstanceUID: row.StudyInstanceUID,
                            },
                            PatientMainDicomTags: {
                                PatientID: row.PatientID
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
        Cell: (row) => {
            return <button type="button" className="btn btn-danger" onClick={(e) => {
                e.stopPropagation();
                onDelete(row.StudyOrthancID)
            }}>Remove</button>
        },
        editable: false,
        csvExport: false
    }]

const columnPatientsFactory = (hiddenActionBouton, hiddenRemoveRow, onDelete, onModify, refresh) => [
    {
        accessor: 'PatientOrthancID',
        show: false
    }, {
        accessor: 'PatientName',
        Header: 'Patient Name',
        sort: true,
        editable: false,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }, {
        accessor: 'PatientID',
        Header: 'Patient ID',
        sort: true,
        editable: false,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }, {
        accessor: 'Action',
        Header: 'Action',
        show: !hiddenActionBouton,
        Cell: (row) => {
            return <ActionBouton level='patients' orthancID={row.PatientOrthancID} onDelete={onDelete}
                                 onModify={onModify} row={row} refresh={refresh}/>
        }
    }, {
        accessor: 'Remove',
        Header: 'Remove',
        show: !hiddenRemoveRow,
        Cell: (row) => {
            return <button type="button" className="btn btn-danger" onClick={(e) => {
                e.stopPropagation();
                onDelete(row.PatientOrthancID)
            }}>Remove</button>
        },
        editable: false
    }]


export {columnStudyFactory, columnPatientsFactory, columnSeriesFactory}