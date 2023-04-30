import React from "react";
import { Button } from "react-bootstrap";

import { filter } from '../../../../model/Constant';
import ConstantLevel from "../../../Modify/ConstantLevel";
import ActionBouton from "../ActionBouton";
import RetrieveButton from "../../../Query/RetrieveButton";
import { errorMessage } from "../../../../tools/toastify";

const commonColumns = {
    RAW: {
        id: 'raw',
        accessorKey: 'raw',
        header: 'RAW',
        enableHiding: true
    },
    AET: {
        id: 'OriginAET',
        accessorKey: 'OriginAET',
        header: 'AET'
    },
}

const patientColumns = {
    ORTHANC_ID: {
        id: 'PatientOrthancID',
        accessorKey: 'PatientOrthancID',
        header: 'PatientOrthancID',
        enableHiding: true
    },
    NAME: {
        id: 'PatientName',
        accessorKey: 'PatientName',
        header: 'Patient Name',
        filterType: filter.STRING_FILTER,
    },
    PARENT_NAME: {
        id: 'ParentPatient.PatientName',
        accessorKey: 'ParentPatient.PatientName',
        header: 'Patient Name',
        filterType: filter.STRING_FILTER
    },
    ID: {
        id: 'PatientID',
        accessorKey: 'PatientID',
        header: 'Patient ID',
        filterType: filter.STRING_FILTER
    },
    PARENT_ID: {
        id: 'ParentPatient.PatientID',
        accessorKey: 'ParentPatient.PatientID',
        header: 'Patient ID',
        filterType: filter.STRING_FILTER
    },
    ACTION: (onDelete, onModify, refresh) => ({
        id: 'Action',
        accessorKey: 'Action',
        header: 'Action',
        cell: (({ row }) => {
            return <ActionBouton
                level={ConstantLevel.PATIENTS}
                orthancID={row.original.PatientOrthancID}
                onDelete={onDelete}
                onModify={onModify}
                dataDetails={row.original}
                refresh={refresh}
                hiddenModify={false}
                hiddenMetadata={true} />
        })
    }),
    REMOVE: (onRemovePatient) => ({
        id: 'Remove',
        accessorKey: 'Remove',
        header: 'Remove',
        cell: (({ row }) => {
            return <Button className="btn btn-danger" onClick={() => {
                onRemovePatient(row.original.PatientOrthancID);
            }}>Remove</Button>
        })
    }),
}

const studyColumns = {
    ORTHANC_ID: {
        id: 'StudyOrthancID',
        accessorKey: 'StudyOrthancID',
        header: 'Study Orthanc ID',
        enableHiding: true,
    },
    STUDY_INSTANCE_UID: {
        id: 'StudyInstanceUID',
        accessorKey: 'StudyInstanceUID',
        header: 'StudyInstanceUID',
        enableHiding: true
    },
    INSTANCE_UID: {
        id: 'StudyInstanceUID',
        accessorKey: 'StudyInstanceUID',
        header: 'StudyInstanceUID',
        enableHiding: true
    },
    ANONYMIZED_FROM: {
        id: 'AnonymizedFrom',
        accessorKey: 'AnonymizedFrom',
        header: 'AnonymizedFrom',
        enableHiding: true
    },
    DATE: {
        id: 'StudyDate',
        accessorKey: 'StudyDate',
        header: 'Acquisition Date',
        filterType: filter.DATE_FILTER
    },
    DESCRIPTION: {
        id: 'StudyDescription',
        accessorKey: 'StudyDescription',
        header: 'Description',
        filterType: filter.STRING_FILTER
    },
    REQUESTED_PROCEDURE: {
        id: 'RequestedProcedureDescription',
        accessorKey: 'RequestedProcedureDescription',
        header: 'Requested Procedure Description',
        filterType: filter.STRING_FILTER
    },
    ACCESSION_NUMBER: {
        id: 'AccessionNumber',
        accessorKey: 'AccessionNumber',
        header: 'Accession Number',
        filterType: filter.STRING_FILTER
    },
    MODALITIES: {
        id: 'ModalitiesInStudy',
        accessorKey: 'ModalitiesInStudy',
        header: 'Modalities',
        filterType: filter.STRING_FILTER
    },
    ANONYMIZED: {
        id: 'Anonymized',
        accessorKey: 'Anonymized',
        header: 'Anonymized ?',
        style: (row) => {
            return { "color": row.original.AnonymizedFrom ? 'lightgreen' : 'orangered' }
        },
        cell: (({ row }) => {
            return row.original.AnonymizedFrom ? 'Yes' : 'No'
        })
    },
    ACTION: (onDelete, refresh, openLabelModal) => ({
        id: 'Action',
        accessorKey: 'Action',
        header: 'Action',
        cell: (({ row }) => {
            return <ActionBouton level={ConstantLevel.STUDIES}
                orthancID={row.original.StudyOrthancID}
                StudyInstanceUID={row.original.StudyInstanceUID}
                onDelete={onDelete}
                dataDetails={row.original}
                refresh={refresh}
                openLabelModal={openLabelModal}
                hiddenModify={false}
                hiddenMetadata={true} />
        })
    }),
    REMOVE: (onRemoveStudy) => ({
        id: 'Remove',
        accessorKey: 'Remove',
        header: 'Remove',
        cell: ({ row }) => {
            return <Button className="btn btn-danger" onClick={() => {
                onRemoveStudy(row.original.StudyOrthancID);
            }}>Remove</Button>
        }
    }),
    NB_STUDY_SERIES: {
        id: 'NumberOfStudyRelatedSeries',
        accessorKey: 'NumberOfStudyRelatedSeries',
        header: 'Series',
    },
    RETRIEVE: {
        id: 'Retrieve',
        accessorKey: 'Retrieve',
        header: 'Retrieve',
        cell: ({ row }) => {
            return <RetrieveButton queryAet={row.original.OriginAET} studyInstanceUID={row.original.StudyInstanceUID}
                level={RetrieveButton.Study} />
        }
    },
}

const seriesColumns = {
    ORTHANC_ID: {
        id: 'SeriesOrthancID',
        accessorKey: 'SeriesOrthancID',
        header: 'SeriesOrthancID',
        enableHiding: true
    },
    DESCRIPTION: {
        id: 'SeriesDescription',
        accessorKey: 'SeriesDescription',
        header: 'Series Description',
        filterType: filter.STRING_FILTER
    },
    MODALITY: {
        id: 'Modality',
        accessorKey: 'Modality',
        header: 'Modality',
        filterType: filter.STRING_FILTER
    },
    SERIES_NUMBER: {
        id: 'SeriesNumber',
        accessorKey: 'SeriesNumber',
        header: 'Series Number',
        filterType: filter.STRING_FILTER
    },
    NUMBER_OF_INSTANCES: {
        id: 'NumberOfInstances',
        accessorKey: 'NumberOfInstances',
        header: 'Instances',
        filterType: filter.NUMBER_FILTER
    },
    ACTION: (onDelete, refresh) => ({
        id: 'Action',
        accessorKey: 'Action',
        header: 'Action',
        cell: ({ row }) => {
            return (
                <ActionBouton
                    level={ConstantLevel.SERIES}
                    orthancID={row.original.SeriesOrthancID}
                    parentID={row.original.StudyOrthancID}
                    onDelete={onDelete}
                    dataDetails={row.original}
                    refresh={refresh}
                    hiddenMetadata={false}
                    hiddenCreateDicom={true}
                    hiddenModify={false} />)
        }
    }),
    REMOVE: (onRemove) => ({
        id: 'Remove',
        accessorKey: 'Remove',
        header: 'Remove',
        cell: ({ row }) => {
            return <Button className="btn btn-danger" onClick={(e) => {
                try {
                    onRemove(row.original.SeriesOrthancID);
                } catch (e) {
                    errorMessage("Remove error");
                }
                e.stopPropagation();
            }}>Remove</Button>
        }
    }),
    NB_SERIES_INSTANCES: {
        id: 'NumberOfSeriesRelatedInstances',
        accessorKey: 'NumberOfSeriesRelatedInstances',
        header: 'Number of instances',
        filterType: filter.NUMBER_FILTER
    },
    RETRIEVE: {
        id: 'Retrieve',
        accessorKey: 'Retrieve',
        header: 'Retrieve',
        cell: ({ row }) => {
            return (<RetrieveButton queryAet={row.original.raw.OriginAET}
                studyInstanceUID={row.original.raw.StudyInstanceUID}
                seriesInstanceUID={row.original.raw.SeriesInstanceUID}
                level={RetrieveButton.Series} />)
        }
    }
}

const studyQueryColumns = {
    PATIENT_NAME: {
        accessorKey: 'PatientName',
        header: "Patient Name",
        style: { whiteSpace: 'normal', wordWrap: 'break-word' },
        filterType: filter.MULTI_SELECT_FILTER,
        filterFn: 'inFilterArray'
    },
    PATIENT_ID: {
        accessorKey: 'PatientID',
        header: "Patient ID",
        style: { whiteSpace: 'normal', wordWrap: 'break-word' },
        filterType: filter.MULTI_SELECT_FILTER,
        filterFn: 'inFilterArray'
    },
    ACCESSION_NUMBER: {
        id: 'AccessionNumber',
        accessorKey: 'AccessionNumber',
        style: { whiteSpace: 'normal', wordWrap: 'break-word' },
        filterType: filter.MULTI_SELECT_FILTER,
        filterFn: 'inFilterArray'
    },
    STUDY_INSTANCE_UID: {
        accessorKey: 'StudyInstanceUID',
        header: 'StudyInstanceUID',
        enableHiding: true
    },
    STUDY_DATE: {
        accessorKey: 'StudyDate',
        header: 'Acquisition Date',
    },
    STUDY_DESCRIPTION: {
        accessorKey: 'StudyDescription',
        header: 'Study Description',
        style: { whiteSpace: 'normal', wordWrap: 'break-word' },
        filterType: filter.MULTI_SELECT_FILTER,
        filterFn: 'inFilterArray'
    },
    REQUESTED_PROCEDURE: {
        accessorKey: 'RequestedProcedureDescription',
        header: 'Requested Procedure Description',
        filterType: filter.MULTI_SELECT_FILTER,
        filterFn: 'inFilterArray'
    },
    MODALITY: {
        id: 'ModalitiesInStudy',
        accessorKey: 'ModalitiesInStudy',
        header: 'Modalities',
        style: { whiteSpace: 'normal', wordWrap: 'break-word' },
        filterType: filter.MULTI_SELECT_FILTER,
        filterFn: 'inFilterArray'
    },
    NB_STUDY_SERIES: {
        accessorKey: 'NumberOfStudyRelatedSeries',
        header: 'Number of series',
        filterType: filter.NUMBER_FILTER,
    },
    NB_SERIES_INSTANCES: {
        accessorKey: 'NumberOfStudyRelatedInstances',
        header: 'Number of instances',
        filterType: filter.NUMBER_FILTER,
    },
    AET: {
        accessorKey: 'OriginAET',
        header: 'AET',
        filterType: filter.MULTI_SELECT_FILTER,
        filterFn: 'inFilterArray'
    },
}

const seriesQueryColumns = {
    SERIES_INSTANCE_UID: {
        accessorKey: 'SeriesInstanceUID',
        header: 'Series Instance UID',
        enableHiding: true
    },
    SERIES_DESCRIPTION: {
        accessorKey: 'SeriesDescription',
        header: 'Series Description',
        style: { whiteSpace: 'normal', wordWrap: 'break-word' },
        filterType: filter.MULTI_SELECT_FILTER,
        filterFn: 'inFilterArray'
    },
    MODALITY: {
        accessorKey: 'Modality',
        header: 'Modality',
        filterType: filter.MULTI_SELECT_FILTER,
        filterFn: 'inFilterArray'
    },
    SERIES_NUMBER: {
        accessorKey: 'SeriesNumber',
        header: 'Series Number',
    },
    NB_SERIES_INSTANCES: {
        accessorKey: 'NumberOfSeriesRelatedInstances',
        header: 'Number of instances',
        filterType: filter.NUMBER_FILTER
    },
    AET: {
        accessorKey: 'OriginAET',
        header: 'AET',
        filterType: filter.MULTI_SELECT_FILTER,
        filterFn: 'inFilterArray'
    },
}
export {
    patientColumns,
    studyColumns,
    seriesColumns,
    commonColumns,
    studyQueryColumns,
    seriesQueryColumns
}