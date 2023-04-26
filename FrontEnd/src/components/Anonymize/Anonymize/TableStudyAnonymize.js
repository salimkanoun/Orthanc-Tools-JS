import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { removeStudyFromAnonList, saveNewValues } from "../../../actions/AnonList";
import { studyColumns } from "../../CommonComponents/RessourcesDisplay/ReactTableV8/ColomnFactories";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ studies }) => {

    const dispatch = useDispatch()

    const onEditStudy = (StudyOrthancID, column, newValue) => {
        dispatch(saveNewValues(StudyOrthancID, column, newValue))
    }


    const onRemoveStudy = (StudyOrthancID) => {
        dispatch(removeStudyFromAnonList(StudyOrthancID))
    }

    const columns = [
        studyColumns.DATE,
        studyColumns.DESCRIPTION,
        {
            id: 'newStudyDescription',
            accessorKey: 'newStudyDescription',
            header: 'New Description',
            isEditable: true
        },
        {
            id: 'newAccessionNumber',
            accessorKey: 'newAccessionNumber',
            header: 'New Accession Number',
            isEditable: true
        },
        {
            id: 'Remove',
            accessorKey: 'Remove',
            header: 'Remove',
            cell: ({ row }) => {
                return <Button className="btn btn-danger" onClick={() => {
                    onRemoveStudy(row.original.StudyOrthancID);
                }}>Remove</Button>
            }
        }
    ]

    return (
        <CommonTableV8 id="StudyOrthancID" data={studies} columns={columns} onCellEdit={onEditStudy} />
    )
}