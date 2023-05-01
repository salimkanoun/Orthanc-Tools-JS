import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import TablePatientWithNestedStudies from "../CommonComponents/RessourcesDisplay/ReactTableV8/TablePatientWithNestedStudies";
import ConstantLevel from "../Modify/ConstantLevel";
import Modify from "../Modify/Modify";
import ActionButtonPatients from "./ActionButtons/ActionButtonPatients";
import ActionButtonStudies from "./ActionButtons/ActionButtonStudies";
import Labels from "../Labels/Labels";

export default ({
    patients = [],
    onClickStudy,
    rowStyle,
    onSelectStudies,
    onDeletePatient,
    onDeleteStudy,
}) => {

    const [modifyOrthancID, setModifyOrthancID] = useState({ orthancID: null, level: null })
    const [labelStudyOrthancID, setLabelStudyOrthancId] = useState(null)

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
                    StudyInstanceUID={row.original.StudyInstanceUID}
                    onDelete={() => onDeleteStudy(row.original.StudyOrthancID)}
                    onShowLabels={() => setLabelStudyOrthancId(row.original.StudyOrthancID)}
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
                    <Modify orthancID={modifyOrthancID.orthancID} level={modifyOrthancID.level} onClose={() => setModifyOrthancID({ orthancID: null, level: null })} />
                </Modal.Body>
            </Modal>

            <Modal show={labelStudyOrthancID != null} onHide={() => setLabelStudyOrthancId(null)} onClick={(e) => e.stopPropagation()} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title> Label Study</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {labelStudyOrthancID ? <Labels studyOrthancID={labelStudyOrthancID} /> : null}
                </Modal.Body>
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