import React, { useMemo } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { removePatientFromAnonList, saveNewValues } from "../../../actions/AnonList";
import { studyArrayToPatientArray } from "../../../tools/processResponse";
import TablePatients from "../../CommonComponents/RessourcesDisplay/ReactTableV8/TablePatients";

export default ({ rowStyle, setCurrentPatient }) => {

    const dispatch = useDispatch()

    const anonList = useSelector(state => state.AnonList.anonList)

    const patients = useMemo(() => studyArrayToPatientArray(anonList), [anonList.length])

    const onRemovePatient = (PatientOrthancID) => {
        dispatch(removePatientFromAnonList(PatientOrthancID))
    }

    const onClickPatientHandler = (PatientOrthancID) => {
        setCurrentPatient(PatientOrthancID)
    }

    const onEditPatient = (PatientOrthancID, column, newValue) => {
        dispatch(saveNewValues(PatientOrthancID, column, newValue))
    }

    const additionalColumns = [
        {
            id: 'newPatientID',
            accessorKey: 'newPatientID',
            header: 'New Patient ID',
            isEditable: true,
        },
        {
            id: 'newPatientName',
            accessorKey: 'newPatientName',
            header: 'New Patient Name',
            isEditable: true
        },
        {
            id: 'Remove',
            accessorKey: 'Remove',
            header: 'Remove',
            cell: ({ row }) => {
                return <Button className="btn btn-danger" onClick={() => {
                    onRemovePatient(row.original.PatientOrthancID);
                }}>Remove</Button>
            }
        }
    ]

    return (
        <TablePatients patients={patients} additionalColumns={additionalColumns} onRowClick={onClickPatientHandler} rowStyle={rowStyle} onCellEdit={onEditPatient} />
    )
}