import React from "react";
import TablePatientWithNestedStudies from "../CommonComponents/RessourcesDisplay/ReactTableV8/TablePatientWithNestedStudies";
import ActionButtonPatients from "./ActionButtons/ActionButtonPatients";
import ActionButtonStudies from "./ActionButtons/ActionButtonStudies";

export default ({
    patients = [],
    onClickStudy,
    rowStyle,
    onSelectStudies,
    onDelete,
    openLabelModal = undefined
}) => {

    const additionalColumnsPatients = [
        {
            id: 'Action',
            accessorKey: 'Action',
            header: 'Action',
            cell: ({ row }) => {
                return (<ActionButtonPatients
                    orthancID={row.original.PatientOrthancID}
                    onDelete={onDelete}
                    dataDetails = {row.original}
                />)
            }
        }
    ]

    const additionalColumnsStudies = [
        {
            id: 'Action',
            accessorKey: 'Action',
            header: 'Action',
            cell: ({ row }) => {
                return <ActionButtonStudies
                    orthancID={row.original.StudyOrthancID}
                    StudyInstanceUID={row.original.StudyInstanceUID}
                    onDelete={onDelete}
                    openLabelModal={openLabelModal} 
                    dataDetails = {row.original}/>
            }
        }
    ]

    return (
        <TablePatientWithNestedStudies
            patients={patients}
            onClickStudy={onClickStudy}
            rowStyle={rowStyle}
            selectablePatient
            selectableStudy
            onSelectStudies={onSelectStudies}
            additionalColumnsPatients={additionalColumnsPatients}
            additionalColumnsStudies={additionalColumnsStudies} />
    )
}