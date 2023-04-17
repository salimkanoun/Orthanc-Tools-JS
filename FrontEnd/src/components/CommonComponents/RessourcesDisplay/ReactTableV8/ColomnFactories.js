import React from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { filter } from '../../../../model/Constant';
import ConstantLevel from "../../../Modify/ConstantLevel";
import RetrieveButton from "../../../Query/Components/RetrieveButton";
import ActionBouton from "../ActionBouton";

const commonColumns = {
    RAW: {
        id: 'raw',
        accessorKey: 'raw',
        header: 'RAW',
        hidden: true
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
        hidden: true
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
        hidden: true,
    },
    STUDY_INSTANCE_UID: {
        id: 'StudyInstanceUID',
        accessorKey: 'StudyInstanceUID',
        header: 'StudyInstanceUID',
        hidden: true
    },
    INSTANCE_UID: {
        id: 'StudyInstanceUID',
        accessorKey: 'StudyInstanceUID',
        header: 'StudyInstanceUID',
        hidden: true
    },
    ANONYMIZED_FROM: {
        id: 'AnonymizedFrom',
        accessorKey: 'AnonymizedFrom',
        header: 'AnonymizedFrom',
        hidden: true
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
        hidden: true
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
                    toast.error("Remove error", { data: { type: 'notification' } });
                }
                e.stopPropagation();
            }}>Remove</Button>
        }
    }),
    NB_SERIES_INSTANCES: {
        id: 'NumberOfSeriesRelatedInstances',
        accessorKey: 'NumberOfSeriesRelatedInstances',
        header: 'Number of instances',
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
export {
    patientColumns,
    studyColumns,
    seriesColumns,
    commonColumns
}