import React, { createRef, Fragment, useCallback, useMemo, useState } from 'react'
import apis from '../../services/apis';
import { toast } from 'react-toastify';

import MonitorJob from '../../tools/MonitorJob'
import { Button, Container, Form, Modal, Row } from 'react-bootstrap';
import { filterProperties } from '../../model/Utils';
import TagTable2 from '../CommonComponents/RessourcesDisplay/ReactTable/TagTable2';
import ConstantLevel from './ConstantLevel';


export default ({
    hidden,
    level,
    orthancID,
    refresh,
    data
}
) => {

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
                toast.error("Wrong level")
        }
    }

    const [show, setShow] = useState(false);
    const [modifications, setModifications] = useState({}); //[key, value]
    const [deletes, setDeletes] = useState([]); //[key]
    const [keepSource, setKeepSource] = useState(localStorage.getItem('keepSource') === 'true' ? true : false);
    const [removePrivateTags, setRemovePrivateTags] = useState(localStorage.getItem('removePrivateTags') === 'true' ? true : false);

    const [toasts, setToasts] = useState({});

    const [dataFilter, setDataFilter] = useState([])

    const filterData = () => {
        let dataFilters = filterProperties(data, keysToKeep(level))
        setDataFilter(dataFilters);
    }

    const updateToast = useCallback((jobId, progress) => {
        console.log(toasts)
        console.log(progress)
        toast.update(toasts[jobId], {
            type: toast.TYPE.INFO,
            autoClose: false,
            render: 'Modify progress : ' + Math.round(progress) + '%'
        })
    }, [Math.random()])



    const successToast = (jobId) => {
        console.log(jobId, toasts)
        toast.update(toasts[jobId], {
            type: toast.TYPE.INFO,
            autoClose: 5000,
            render: 'Modify Done',
            className: 'bg-success'
        })
    }

    const failToast = (jobId) => {
        console.log(jobId, toasts)
        toast.update(toasts[jobId], {
            type: toast.TYPE.INFO,
            autoClose: 5000,
            render: 'Modify fail',
            className: 'bg-danger'
        })
    }

    const createToast = (jobId) => {
        const toastId = toast.info("Modify progress : 0%", { autoClose: false })
        console.log(jobId, toastId)
        setToasts({
            ...toasts,
            [jobId]: toastId
        }
        )
    }

    const openModify = () => {
        filterData()
        setModifications({})
        setShow(true)
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
            toast.error('No Modification set')
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
                toast.error("Wrong level")
        }
        if (jobAnswer !== '') {
            let jobId = jobAnswer.ID
            let jobMonitoring = new MonitorJob(jobId)

            jobMonitoring.onUpdate( (progress)=> {
                console.log(toasts)
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
        }
    }

    if (hidden) return <></>

    return (
        <Fragment>
            <Button className='dropdown-item bg-orange' onClick={openModify}>Modify</Button>

            <Modal show={show} onHide={() => setShow(false)} onClick={(e) => e.stopPropagation()} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title> Modify {level}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TagTable2 data={dataFilter} onDataUpdate={onDataUpdate} onDeleteTag={onDeleteTag} modifications={modifications} deleted={deletes} />
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
                </Modal.Body>
                <Modal.Footer>
                    <Button className='otjs-button otjs-button-orange me-5' onClick={() => modify()}>Modify</Button>
                    <Button className='otjs-button otjs-button-red' onClick={() => setShow(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )

}