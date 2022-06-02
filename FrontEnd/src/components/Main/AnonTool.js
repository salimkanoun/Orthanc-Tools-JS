import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import TablePatientsWithNestedStudies
    from '../CommonComponents/RessourcesDisplay/ReactTable/TablePatientsWithNestedStudies'

import { emptyAnonymizeList, removePatientFromAnonList, removeStudyFromAnonList } from '../../actions/AnonList'
import { studyArrayToPatientArray } from '../../tools/processResponse'


export default ({ target, show, onHide }) => {

    const dispatch = useDispatch();

    const store = useSelector(state => {
        return {
            anonList: state.AnonList.anonList
        }
    })

    const patientsRows = useMemo(() => studyArrayToPatientArray(store.anonList), [store.anonList])

    const onRemovePatient = (patientOrthancID) => {
        console.log('anon list avant:', store.anonList)
        console.log('patientOrthancID', patientOrthancID)
        dispatch(removePatientFromAnonList(patientOrthancID))
        console.log('anon list apres:', store.anonList)
    }

    const onRemoveStudy = (studyOrthancID) => {
        console.log('anon list avant:', store.anonList)
        console.log('studyOrthancID', studyOrthancID)
        dispatch(removeStudyFromAnonList(studyOrthancID))
        console.log('anon list apres:', store.anonList)
    }

    const handleClickEmpty = () => {
        dispatch(emptyAnonymizeList())
    }

    return (
        <Overlay target={target} show={show} placement="bottom" onHide={onHide}
            rootClose>
            <Popover id="popover-basic" style={{ maxWidth: '100%' }}>
                <Popover.Header as="h3">Anon List</Popover.Header>
                <Popover.Body>
                    <div className="float-right mb-3">
                        <button type="button" className="btn otjs-button otjs-button-orange p-2" onClick={handleClickEmpty}>Empty
                            List
                        </button>
                    </div>
                    <TablePatientsWithNestedStudies
                        patients={patientsRows}
                        actionBouton={false}
                        removeRow={true}
                        onRemovePatient={onRemovePatient}
                        onRemoveStudy={onRemoveStudy}
                        selectable={false}
                        onSelectStudies={() => { }}
                        wrapperClasses="table-responsive"
                    />
                </Popover.Body>
            </Popover>
        </Overlay>
    )

}
