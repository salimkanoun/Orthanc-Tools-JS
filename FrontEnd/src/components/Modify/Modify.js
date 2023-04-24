import React, { Fragment, useEffect, useState } from 'react'
import { Button, Container, Form, Row } from 'react-bootstrap';

import { filterProperties } from '../../model/Utils';
import ConstantLevel from './ConstantLevel';
import TagTable from './TagTable';

import apis from '../../services/apis';
import { errorMessage, jobMessageToNotificationCenter } from '../../tools/toastify';


export default ({
    level,
    orthancID,
    onClose
}) => {

    const keysToKeep = (level) => {
        switch (level) {
            case ConstantLevel.PATIENTS:
                return [
                    'PatientName',
                    'PatientID',
                    'PatientBirthDate',
                    'PatientSex',
                    'OtherPatientIDs'
                ]
            case ConstantLevel.STUDIES:
                return [
                    'StudyDate',
                    'StudyTime',
                    'StudyID',
                    'StudyDescription',
                    'AccessionNumber',
                    'RequestedProcedureDescription',
                    'InstitutionName',
                    'RequestingPhysician',
                    'ReferringPhysicianName'
                ]
            case ConstantLevel.SERIES:
                return [
                    'SeriesDate',
                    'SeriesTime',
                    'Modality',
                    'Manufacturer',
                    'StationName',
                    'SeriesDescription',
                    'BodyPartExamined',
                    'SequenceName',
                    'ProtocolName',
                    'SeriesNumber'
                ]
            default:
                return null
        }
    }

    const [modifications, setModifications] = useState({}); //[key, value]
    const [deletes, setDeletes] = useState([]); //[key]
    const [keepSource, setKeepSource] = useState(localStorage.getItem('keepSource') === 'true' ? true : false);
    const [removePrivateTags, setRemovePrivateTags] = useState(localStorage.getItem('removePrivateTags') === 'true' ? true : false);
    const [dataFiltered, setDataFiltered] = useState({})

    useEffect(() => {
        dataFilters()
    }, [])

    const dataFilters = async () => {
        let data
        try {
            if (level === ConstantLevel.PATIENTS) data = await apis.content.getPatientDetails(orthancID)
            if (level === ConstantLevel.STUDIES) data = await apis.content.getStudiesDetails(orthancID)
            if (level === ConstantLevel.SERIES) data = await apis.content.getSeriesDetails(orthancID)
            let dataFilters = filterProperties(data.MainDicomTags, keysToKeep(level))
            setDataFiltered(dataFilters)
        } catch (error) {
            errorMessage(error?.data?.errorMessage ?? 'Fetch details Failed')
        }

    }

    const checkRemember = () => {
        localStorage.setItem('keepSource', keepSource)
        localStorage.setItem('removePrivateTags', removePrivateTags)
    }

    const onCellEdit = (tagName, column, value) => {
        if (value == '') value = null;
        if (value != null) {
            setModifications((state) => {
                return {
                    ...state,
                    [tagName]: value
                }
            })
        }

    }

    const onDeleteTag = (tagName, deleted) => {
        if (deleted) {
            setDeletes((state) => {
                let newState = [...state]
                if (!newState.includes(tagName)) newState.push(tagName)
                return newState
            })
        } else {
            setDeletes((state) => {
                let newState = [...state]
                if (newState.includes(tagName)) newState = newState.filter(name => (name !== tagName))
                return newState
            })
        }
    }

    const modify = async () => {
        checkRemember()
        //If no change done, simply return
        if (Object.keys(modifications).length === 0 && deletes.length === 0) {
            errorMessage('No Modification set')
            return
        }
        let jobAnswer = ''
        switch (level) {
            case ConstantLevel.PATIENTS:
                if (modifications?.PatientID == null) {
                    errorMessage('PatientID can\'t be empty or the same as before!')
                    return
                } else {
                    jobAnswer = await apis.content.modifyPatients(orthancID, modifications, deletes, removePrivateTags, keepSource)
                }
                break
            case ConstantLevel.STUDIES:
                jobAnswer = await apis.content.modifyStudy(orthancID, modifications, deletes, removePrivateTags, keepSource)
                break
            case ConstantLevel.SERIES:
                jobAnswer = await apis.content.modifySeries(orthancID, modifications, deletes, removePrivateTags, keepSource)
                break
            default:
                return null

        }
        jobMessageToNotificationCenter('Modify',  { ID: jobAnswer.ID, level: level })
        onClose()
    }


    return (
        <Fragment>

            <TagTable data={dataFiltered} onCellEdit={onCellEdit} onDeleteTag={onDeleteTag} modifications={modifications} deleted={deletes} />
            <Container>
                <Row>
                    <Form.Group>
                        <Form.Label>
                            Removing private tags
                        </Form.Label>
                        <Form.Check
                            checked={removePrivateTags}
                            onClick={() => setRemovePrivateTags(!removePrivateTags)}
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group>
                        <Form.Label>
                            Keep Source
                        </Form.Label>
                        <Form.Check
                            checked={keepSource}
                            onClick={() => setKeepSource(!keepSource)}
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Button className='otjs-button otjs-button-orange me-5' onClick={() => modify()}>Modify</Button>
                    <Button className='otjs-button otjs-button-red' onClick={() => onClose()}>Cancel</Button>
                </Row>
            </Container>
        </Fragment>
    )

}