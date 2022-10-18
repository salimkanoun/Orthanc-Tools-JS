import ActionBouton from "../ActionBouton";
import React from "react";
import { dateFilter, DateFilter, invertableDataFilter, InvertableDataFilter } from "./ColumnFilters";
import RetrieveButton from "../../../Query/Components/RetrieveButton";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";

const commonColumns = {
    RAW: {
        accessor: 'raw',
        Header: 'RAW',
        show: false,
    },
    AET: {
        accessor: 'OriginAET',
        Header: 'AET'
    },
}

const seriesColumns = {
    ORTHANC_ID: {
        accessor: 'SeriesOrthancID',
        Header: 'SeriesOrthancID',
        show: false,
    },
    DESCRIPTION: {
        accessor: 'SeriesDescription',
        Header: 'Series Description',
        Filter: InvertableDataFilter('Series Description'),
        filter: invertableDataFilter,
        sort: true,
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    },
    MODALITY: {
        accessor: 'Modality',
        Header: 'Modality',
        Filter: InvertableDataFilter('Modality'),
        filter: invertableDataFilter,
        sort: true
    },
    SERIES_NUMBER: {
        accessor: 'SeriesNumber',
        Header: 'Series Number',
        Filter: InvertableDataFilter('Series Number'),
        filter: invertableDataFilter,
        sort: true
    },
    ACTION: (onDelete, refresh) => ({
        id: 'Action',
        Header: 'Action',
        Cell: ({ row }) => <ActionBouton level='series' orthancID={row.values.SeriesOrthancID}
            parentID={row.values.StudyID} onDelete={onDelete}
            dataDetails={row.values.raw} refresh={refresh}
            hiddenMetadata={false} hiddenCreateDicom={true}
            hiddenModify={false} />
    }),
    REMOVE: (onRemove) => ({
        id: 'Remove',
        Header: 'Remove',
        Cell: ({ row }) => {
            return <Button className="btn btn-danger" onClick={(e) => {
                try {
                    onRemove(row.values.SeriesOrthancID);
                } catch (e) {
                    toast.error("Remove error");
                }
                e.stopPropagation();
            }}>Remove</Button>
        }
    }),
    NB_SERIES_INSTANCES: {
        accessor: 'NumberOfSeriesRelatedInstances',
        Header: 'Number of instances'
    },
    RETRIEVE: {
        id: 'Retrieve',
        Header: 'Retrieve',
        Cell: ({ row }) => {
            return (<RetrieveButton queryAet={row.values.raw.OriginAET}
                studyInstanceUID={row.values.raw.StudyInstanceUID}
                seriesInstanceUID={row.values.raw.SeriesInstanceUID}
                level={RetrieveButton.Series} />)
        }
    }
}

const studyColumns = {
    ORTHANC_ID: {
        accessor: 'StudyOrthancID',
        Header: 'Study Orthanc ID',
        show: false
    },
    STUDY_INSTANCE_UID: {
        accessor: 'StudyInstanceUID',
        Header: 'StudyInstanceUID',
        show: false
    },
    INSTANCE_UID: {
        accessor: 'StudyInstanceUID',
        Header: 'StudyInstanceUID',
        show: false
    },
    ANONYMIZED_FROM: {
        accessor: 'AnonymizedFrom',
        Header: 'AnonymizedFrom',
        show: false
    },
    DATE: {
        accessor: 'StudyDate',
        Header: 'Acquisition Date',
        Filter: DateFilter('Acquisition Date'),
        filter: dateFilter,
        sort: true,
    },
    DESCRIPTION: {
        accessor: 'StudyDescription',
        Header: 'Description',
        Filter: InvertableDataFilter('Description'),
        filter: invertableDataFilter,
        sort: true,
        style: {
            whiteSpace: 'normal',
            wordWrap: 'break-word'
        }
    },
    REQUESTED_PROCEDURE: {
        accessor: 'RequestedProcedureDescription',
        Header: 'Requested Procedure Description',
        Filter: InvertableDataFilter('Procedure Description'),
        filter: invertableDataFilter,
        sort: true
    },
    ACCESSION_NUMBER: {
        accessor: 'AccessionNumber',
        Header: 'Accession Number',
        Filter: InvertableDataFilter('Procedure Description'),
        filter: invertableDataFilter,
        sort: true,
        editable: false
    },
    MODALITIES: {
        accessor: 'ModalitiesInStudy',
        Header: 'Modalities',
        Filter: InvertableDataFilter('Modalities'),
        filter: invertableDataFilter,
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    },

    ANONYMIZED: {
        accessor: 'Anonymized',
        Header: 'Anonymized ?',
        style: (row) => {
            return { "color": row.values.AnonymizedFrom ? 'lightgreen' : 'orangered' }
        },
        classes: 'text-center',
        Cell: ({ row }) => {
            return row.values.AnonymizedFrom ? 'Yes' : 'No'
        },
    },
    ACTION: (onDelete, refresh, openLabelModal) => ({
        id: 'Action',
        Header: 'Action',
        Cell: (({ row }) => (<>
            <ActionBouton level='studies'
                orthancID={row.values.StudyOrthancID}
                StudyInstanceUID={row.values.StudyInstanceUID}
                onDelete={onDelete}
                dataDetails={row.original}
                refresh={refresh}
                openLabelModal={openLabelModal}
                hiddenModify={false} />
        </>)

        ),
    }),
    REMOVE: (onRemoveStudy) => ({
        id: 'Remove',
        Header: 'Remove',
        Cell: ({ row }) => {
            return <Button className="btn btn-danger" onClick={() => {
                onRemoveStudy(row.values.StudyOrthancID);
            }}>Remove</Button>
        },
    }),
    NB_STUDY_SERIES: {
        accessor: 'NumberOfStudyRelatedSeries',
        Header: 'Series'
    },
    RETRIEVE: {
        id: 'Retrieve',
        Header: 'Retrieve',
        Cell: ({ row }) => {
            return (<RetrieveButton queryAet={row.values.OriginAET} studyInstanceUID={row.values.StudyInstanceUID}
                level={RetrieveButton.Study} />)
        }
    },
}

const patientColumns = {
    ORTHANC_ID: {
        accessor: 'PatientOrthancID',
        Header: 'PatientOrthancID',
        show: false
    },
    NAME: (textNameColumn = 'Patient Name') => ({
        accessor: 'PatientName',
        Header: textNameColumn,
        Filter: InvertableDataFilter('Patient Name'),
        filter: invertableDataFilter,
        sort: true,
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    }),

    PARENT_NAME: (textNameColumn = 'Patient Name') => ({
        accessor: 'ParentPatient.PatientName',
        Header: textNameColumn,
        Filter: InvertableDataFilter('Patient Name'),
        filter: invertableDataFilter,
        sort: true,
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    }),

    ID: (textIDColumn = 'Patient ID') => ({
        accessor: 'PatientID',
        Header: textIDColumn,
        Filter: InvertableDataFilter('Patient ID'),
        filter: invertableDataFilter,
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    }),

    PARENT_ID: (textIDColumn = 'Patient ID') => ({
        accessor: 'ParentPatient.PatientID',
        Header: textIDColumn,
        Filter: InvertableDataFilter('Patient ID'),
        filter: invertableDataFilter,
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    }),

    ACTION: (onDelete, onModify, refresh) => ({
        id: 'Action',
        Header: 'Action',
        Cell: ({ row }) => {
            return <ActionBouton level='patients' orthancID={row.values.PatientOrthancID} onDelete={onDelete}
                onModify={onModify} dataDetails={row.original} refresh={refresh} hiddenModify={false} />
        }
    }),
    REMOVE: (onRemovePatient) => ({
        id: 'Remove',
        Header: 'Remove',
        Cell: ({ row }) => {
            return <Button className="btn btn-danger" onClick={() => {
                onRemovePatient(row.values.PatientOrthancID);
            }}>Remove</Button>
        },
        editable: false
    })
}


export {
    patientColumns,
    studyColumns,
    seriesColumns,
    commonColumns
}