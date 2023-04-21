import React, { Fragment, useCallback, useEffect, useState } from 'react'
import apis from '../../services/apis';
import { toast } from 'react-toastify';

import { Container, Form, Row } from 'react-bootstrap';
import { filterProperties } from '../../model/Utils';
import ConstantLevel from './ConstantLevel';
import TagTable from '../CommonComponents/RessourcesDisplay/ReactTableV8/TagTable';


export default ({
    level,
    orthancID,
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

    const [show, setShow] = useState(false);
    const [modifications, setModifications] = useState({}); //[key, value]
    const [deletes, setDeletes] = useState([]); //[key]
    const [keepSource, setKeepSource] = useState(localStorage.getItem('keepSource') === 'true' ? true : false);
    const [removePrivateTags, setRemovePrivateTags] = useState(localStorage.getItem('removePrivateTags') === 'true' ? true : false);
    const [dataFiltered, setDataFiltered] = useState([])

    useEffect(() => {
        dataFilters()
        setModifications({})
    }, [])

    const dataFilters = async () => {
        let data
        if (level === ConstantLevel.PATIENTS) data = await apis.content.getPatientDetails(orthancID)
        if (level === ConstantLevel.STUDIES) data = await apis.content.getStudiesDetails(orthancID)
        if (level === ConstantLevel.SERIES) data = await apis.content.getSeriesDetails(orthancID)
        let dataFilters = filterProperties(data.MainDicomTags, keysToKeep(level))
        setDataFiltered(dataFilters)
        console.log(dataFiltered)
    }

    const checkRemember = () => {
        localStorage.setItem('keepSource', keepSource)
        localStorage.setItem('removePrivateTags', removePrivateTags)
    }

    const onDataUpdate = (key, value) => {
        if (value == '') value = null;
        if (value != null) {
            setModifications((state) => {
                return {
                    ...state,
                    [key]: value
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
            toast.error('No Modification set', { data: { type: 'notification' } })
            return
        }
        let jobAnswer = ''
        switch (level) {
            case ConstantLevel.PATIENTS:
                if (modifications?.PatientID == null)
                    alert('PatientID can\'t be empty or the same as before!')
                else {
                    jobAnswer = await apis.content.modifyPatients(orthancID, modifications, deletes, removePrivateTags, keepSource)
                    setShow(false)
                }
                break
            case ConstantLevel.STUDIES:
                jobAnswer = await apis.content.modifyStudy(orthancID, modifications, deletes, removePrivateTags, keepSource)
                setShow(false)
                break
            case ConstantLevel.SERIES:
                jobAnswer = await apis.content.modifySeries(orthancID, modifications, deletes, removePrivateTags, keepSource)
                setShow(false)
                break
            default:
                return null
        }


        /*if (jobAnswer !== '') {
            let jobId = jobAnswer.ID
            let jobMonitoring = new MonitorJob(jobId)

            jobMonitoring.onUpdate((progress) => {
                updateToast(jobId, progress)
            })

            jobMonitoring.onFinish(function (state) {
                if (state === MonitorJob.Success) {
                    successToast(jobId)
                    refresh()
                } else if (state === MonitorJob.Failure) {
                    failToast(jobId)
                }
            })
            createToast(jobId)
            jobMonitoring.startMonitoringJob()
        }*/
    }

    
    /*const updateToast = useCallback((jobId, progress) => {
        toast.update(toasts[jobId], { containerId: 'jobs' },
            {
                type: toast.TYPE.INFO,
                autoClose: false,
                render: 'Modify progress : ' + Math.round(progress) + '%',
                data: { type: 'jobs' },
            })
    }, [Math.random()])



    const successToast = (jobId) => {
        toast.update(toasts[jobId], { containerId: 'jobs' },
            {
                type: toast.TYPE.INFO,
                autoClose: 5000,
                render: 'Modify Done',
                className: 'bg-success',
                data: { type: 'jobs' }
            })
    }

    const failToast = (jobId) => {
        toast.update(toasts[jobId], { containerId: 'jobs' },
            {
                type: toast.TYPE.INFO,
                autoClose: 5000,
                render: 'Modify fail',
                className: 'bg-danger',
                data: { type: 'jobs' }
            })
    }

    const createToast = (jobId) => {
        const toastId = toast.info("Modify progress : 0%", { containerId: 'jobs' },
            { autoClose: false, data: { type: 'jobs' } })
        setToasts({
            ...toasts,
            [jobId]: toastId
        }
        )
    } */

    return (
        <Fragment>

            <TagTable data={dataFiltered} onDataUpdate={onDataUpdate} onDeleteTag={onDeleteTag} modifications={modifications} deleted={deletes} />
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
            </Container>
        </Fragment>
    )

}