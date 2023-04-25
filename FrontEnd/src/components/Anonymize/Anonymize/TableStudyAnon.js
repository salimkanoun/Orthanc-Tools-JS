import React from "react";
import { Button } from "react-bootstrap";
import { studyColumns } from "../../CommonComponents/RessourcesDisplay/ReactTableV8/ColomnFactories";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ studies, onRemoveStudy, onCellEdit}) => {

    const columns = [
        studyColumns.DATE,
        studyColumns.DESCRIPTION,
        {
            id: 'newDescription',
            accessorrKey: 'newDescription',
            header: 'New Description',
            isEditable: true
        },
        {
            id: 'newAccessionNumber',
            accessorrKey: 'newAccessionNumber',
            header: 'New Accession Number',
            isEditable: true
        },
        {
            id: 'Remove',
            accessorrKey: 'Remove',
            header: 'Remove',
            cell: ({ row }) => {
                return <Button className="btn btn-danger" onClick={() => {
                    onRemoveStudy(row.original.StudyOrthancID);
                }}>Remove</Button>
            }
        }
    ]

    return (
        <CommonTableV8 id="StudyOrthancID" data={studies} columns={columns} onCellEdit={onCellEdit} />
    )
}