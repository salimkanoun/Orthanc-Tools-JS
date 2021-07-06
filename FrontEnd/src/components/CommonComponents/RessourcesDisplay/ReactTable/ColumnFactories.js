import ActionBouton from "../ActionBouton";
import React from "react";
import {InputCell as EditableCell} from "./EditableCells";
import {dateFilter, DateFilter, invertableDataFilter, InvertableDataFilter} from "./ColumnFilters";

const columnSeriesFactory = (hiddenActionBouton, hiddenRemoveRow, onDelete, refresh) => [
    {
        accessor: 'SeriesOrthancID',
        show: false,
    }, {
        accessor: 'raw',
        show: false
    }, {
        accessor: 'SeriesDescription',
        Header: 'Series Description',
        Filter: InvertableDataFilter('Series Description'),
        filter: invertableDataFilter,
        sort: true,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }, {
        accessor: 'Modality',
        Header: 'Modality',
        Filter: InvertableDataFilter('Modality'),
        filter: invertableDataFilter,
        sort: true
    }, {
        accessor: 'SeriesNumber',
        Header: 'Series Number',
        Filter: InvertableDataFilter('Series Number'),
        filter: invertableDataFilter,
        sort: true
    }, {
        id: 'Action',
        Header: 'Action',
        show: !hiddenActionBouton,
        Cell: ({row}) => <ActionBouton level='series' orthancID={row.values.SeriesOrthancID}
                                       parentID={row.values.StudyID} onDelete={onDelete}
                                       row={row.values.raw} refresh={refresh}
                                       hiddenMetadata={false} hiddenCreateDicom={true}/>
    }, {
        id: 'Remove',
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

const columnStudyFactory = (hiddenActionBouton, hiddenRemoveRow, hiddenAccessionNumber, hiddenName, hiddenID, onDelete, refresh, showEditable = false, hiddenAnonymized = true, openLabelModal = undefined, showModalities = false) => [
    {
        accessor: 'StudyOrthancID',
        Header: 'Study Orthanc ID',
        show: false
    }, {
        accessor: 'raw',
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
        Filter: InvertableDataFilter('Patient Name'),
        filter: invertableDataFilter,
        show: !hiddenName,
    }, {
        accessor: 'PatientID',
        Header: 'Patient ID',
        Filter: InvertableDataFilter('Patient Name'),
        filter: invertableDataFilter,
        sort: true,
        show: !hiddenID,
    }, {
        accessor: 'StudyDate',
        Header: 'Acquisition Date',
        Filter: DateFilter('Acquisition Date'),
        filter: dateFilter,
        sort: true,
    }, {
        accessor: 'StudyDescription',
        Header: 'Description',
        Filter: InvertableDataFilter('Description'),
        filter: invertableDataFilter,
        sort: true,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }, {
        accessor: 'newStudyDescription',
        Header: 'New Description',
        show: showEditable,
        Cell: EditableCell,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }, {
        accessor: 'RequestedProcedureDescription',
        Header: 'Requested Procedure Description',
        Filter: InvertableDataFilter('Procedure Description'),
        filter: invertableDataFilter,
        sort: true
    }, {
        accessor: 'AccessionNumber',
        Header: 'Accession Number',
        Filter: InvertableDataFilter('Procedure Description'),
        filter: invertableDataFilter,
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
        accessor: 'ModalitiesInStudy',
        Header: 'Modalities',
        Filter: InvertableDataFilter('Modalities'),
        filter: invertableDataFilter,
        show: showModalities,
        style: {whiteSpace: 'normal', wordWrap: 'break-word'}
    }, {
        id: 'Action',
        Header: 'Action',
        show: !hiddenActionBouton,
        Cell: (({row}) =>
                (<>
                    <ActionBouton level='studies' orthancID={row.values.StudyOrthancID}
                                  StudyInstanceUID={row.values.StudyInstanceUID} onDelete={onDelete}
                                  row={row.values.raw}
                                  refresh={refresh} openLabelModal={openLabelModal}/>
                </>)
        ),
    }, {
        id: 'Remove',
        Header: 'Remove',
        show: !hiddenRemoveRow,
        Cell: ({row}) => {
            return <button type="button" className="btn btn-danger" onClick={(e) => {
                e.stopPropagation();
                onDelete(row.values.StudyOrthancID)
            }}>Remove</button>
        },
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
    }]

const columnPatientsFactory = (hiddenActionBouton, hiddenRemoveRow, onDelete, onModify, refresh, showEditable = false,
                               textNameColumn = 'Patient Name', textIDColumn = 'Patient ID') => [
    {
        accessor: 'PatientOrthancID',
        show: false
    }, {
        accessor: 'raw',
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
        id: 'Action',
        Header: 'Action',
        show: !hiddenActionBouton,
        Cell: ({row}) => {
            return <ActionBouton level='patients' orthancID={row.values.PatientOrthancID} onDelete={onDelete}
                                 onModify={onModify} row={row.values.raw} refresh={refresh}/>
        }
    }, {
        id: 'Remove',
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


export {columnStudyFactory, columnPatientsFactory, columnSeriesFactory, EditableCell}