import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import TablePatientWithNestedStudies from "../CommonComponents/RessourcesDisplay/ReactTableV8/TablePatientWithNestedStudies";
import ConstantLevel from "../Modify/ConstantLevel";
import Modify from "../Modify/Modify";
import ActionButtonPatients from "./ActionButtons/ActionButtonPatients";
import ActionButtonStudies from "./ActionButtons/ActionButtonStudies";

export default ({
    patients = [],
    onClickStudy,
    rowStyle,
    onSelectStudies,
    onDeletePatient,
    onDeleteStudy,
    openLabelModal = () => { }
}) => {

    const [modifyOrthancID, setModifyOrthancID] = useState({ orthancID: null, level: null })

    const additionalColumnsPatients = [
        {
            id: 'Action',
            accessorKey: 'Action',
            header: 'Action',
            cell: ({ row }) => {

                return (<ActionButtonPatients
                    orthancID={row.original.PatientOrthancID}
                    onDelete={() => onDeletePatient(row.original.PatientOrthancID)}
                    dataDetails={row.original}
                    onShowModify={() => setModifyOrthancID({ orthancID: row.original.PatientOrthancID, level: ConstantLevel.PATIENTS })}
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
                    onDelete={() => onDeleteStudy(row.original.StudyOrthancID)}
                    openLabelModal={openLabelModal}
                    dataDetails={row.original}
                    onShowModify={() => setModifyOrthancID({ orthancID: row.original.StudyOrthancID, level: ConstantLevel.STUDIES })}
                />
            }
        }
    ]

    return (
        <>
            <Modal show={modifyOrthancID.orthancID != null} onHide={() => setModifyOrthancID({ orthancID: null, level: null })} onClick={(e) => e.stopPropagation()} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title> Modify {modifyOrthancID.level}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Modify orthancID={modifyOrthancID.orthancID} level={modifyOrthancID.level} />
                </Modal.Body>
                <Modal.Footer>
                    <Button className='otjs-button otjs-button-orange me-5' /*onClick={() => modify()}*/>Modify</Button>
                    <Button className='otjs-button otjs-button-red' onClick={() => setModifyOrthancID({ orthancID: null, level: null })}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            <TablePatientWithNestedStudies
                patients={patients}
                onClickStudy={onClickStudy}
                rowStyle={rowStyle}
                selectablePatient
                selectableStudy
                onSelectStudies={onSelectStudies}
                additionalColumnsPatients={additionalColumnsPatients}
                additionalColumnsStudies={additionalColumnsStudies} />
        </>
    )
}