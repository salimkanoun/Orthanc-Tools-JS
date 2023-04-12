import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'

import { emptyAnonymizeList, removePatientFromAnonList, removeStudyFromAnonList } from '../../actions/AnonList'
import { studyArrayToPatientArray } from '../../tools/processResponse'
import { Button } from 'react-bootstrap'
import { patientColumns } from '../CommonComponents/RessourcesDisplay/ReactTableV8/ColomnFactories'
import TablePatientWithNestedStudies from '../CommonComponents/RessourcesDisplay/ReactTableV8/TablePatientWithNestedStudies'


export default ({ target, show, onHide }) => {

    const dispatch = useDispatch();

    const store = useSelector(state => {
        return {
            anonList: state.AnonList.anonList
        }
    })

    const patientsRows = useMemo(() => studyArrayToPatientArray(store.anonList), [store.anonList])

    const onRemovePatient = (patientOrthancID) => {
        dispatch(removePatientFromAnonList(patientOrthancID))
    }

    const onRemoveStudy = (studyOrthancID) => {
        dispatch(removeStudyFromAnonList(studyOrthancID))
    }

    const handleClickEmpty = () => {
        dispatch(emptyAnonymizeList())
    }

    const additionalColumnsPatients = [
        patientColumns.REMOVE(onRemovePatient)
    ]

    return (
        <Overlay target={target} show={show} placement="bottom" onHide={onHide}
            rootClose>
            <Popover id="popover-basic" style={{ maxWidth: '100%' }}>
                <Popover.Header as="h3">Anon List</Popover.Header>
                <Popover.Body>
                    <div className="float-right mb-3">
                        <Button className="btn otjs-button otjs-button-orange p-2" onClick={handleClickEmpty}>Empty
                            List
                        </Button>
                    </div>

                    <TablePatientWithNestedStudies patients={patientsRows} additionalColumnsPatients={additionalColumnsPatients} onSelectStudies={() => { }} />
                </Popover.Body>
            </Popover>
        </Overlay>
    )

}
