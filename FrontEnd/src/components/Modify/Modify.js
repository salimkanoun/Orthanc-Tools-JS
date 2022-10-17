import React, { createRef, Fragment, useState } from 'react'
import apis from '../../services/apis';
import { toast } from 'react-toastify';

import MonitorJob from '../../tools/MonitorJob'
import ModalModify from './ModalModify';
import { Button } from 'react-bootstrap';


export default ({
    hidden,
    level,
    orthancID,
    refresh,
    row
}
) => {
    const [show, setShow] = useState(false);
    const [modification, setModification] = useState({});
    const [deletes, setDeletes] = useState([]);
    const [toasts, setToasts] = useState({});
    const [keepSource, setKeepSource] = useState(localStorage.getItem('remember') === 'true' ? localStorage.getItem('keepSource') === 'true' : false);
    const [removePrivateTags, setRemovePrivateTags] = useState(localStorage.getItem('remember') === 'true' ? localStorage.getItem('removePrivateTags') === 'true' : false);
    const [data, setData] = useState();
    const [remember, setRemember] = useState();

    const updateToast = (id, progress) => {
        toast.update(toasts[id].current, {
            type: toast.TYPE.INFO,
            autoClose: false,
            render: 'Modify progress : ' + Math.round(progress) + '%'
        })
    }

    const successToast = (id) => {
        toast.update(toasts[id].current, {
            type: toast.TYPE.INFO,
            autoClose: 5000,
            render: 'Modify Done',
            className: 'bg-success'
        })
    }

    const failToast = (id) => {
        toast.update(toasts[id].current, {
            type: toast.TYPE.INFO,
            autoClose: 5000,
            render: 'Modify fail',
            className: 'bg-danger'
        })
    }

    const openToast = (id) => {
        setToasts(
            toasts,
            [id] = { current: toast("Notify progress : 0%", { autoClose: false, className: 'bg-info' }) }

        )
    }

    const openModify = () => {
        setModification({})
        setShow(true)
        let rows = []
        let forbidden = ['studies', 'OtherPatientIDs', 'Instances', 'StudyOrthancID', 'PatientOrthancID', 'SeriesOrthancID', 'StudyID', 'SeriesInstanceUID', 'StudyInstanceUID']
        for (let tag in row) {
            if (!forbidden.includes(tag))
                rows.push(
                    {
                        'TagName': tag,
                        'Value':
                            row[tag] ?
                                row[tag] : '',
                        deletable: false
                    })
        }
        setData(rows)
    }

    const checkRemember = () => {
        localStorage.setItem('keepSource', keepSource)
        localStorage.setItem('removePrivateTags', removePrivateTags)
        setRemovePrivateTags(localStorage.getItem('removePrivateTags') === 'true')
        setKeepSource(localStorage.getItem('keepSource') === 'true')

    }

    const handleDataChange = (oldValue, newValue, row, column) => {
        let modification = modification;
        let deletes = deletes;
        if (column === 'Value') {
            modification[row.TagName] = newValue;
        } else {
            if (newValue) {
                deletes.push(row.TagName);
            } else {
                deletes = deletes.filter(x => x !== row.TagName);
            }
        }
        const data = data;
        data.find(x => x.TagName === row.TagName)[column] = newValue;


        setModification(modification)
        setData([...data])
        setDeletes(deletes)

    }

    const modify = async () => {
        checkRemember()
        //If no change done, simply return
        if (Object.keys(modification).length === 0) {
            toast.error('No Modification set')
            return
        }

        let jobAnswer = ''
        switch (level) {
            case 'patients':
                if (!modification.PatientID || modification.PatientID === '')
                    alert('PatientID can\'t be empty or the same as before!')
                else {
                    jobAnswer = await apis.content.modifyPatients(orthancID, modification, deletes, removePrivateTags, keepSource)
                    onHide()
                }
                break
            case 'studies':
                jobAnswer = await apis.content.modifyStudy(orthancID, modification, deletes, removePrivateTags, keepSource)
                onHide()
                break
            case 'series':
                jobAnswer = await apis.content.modifySeries(orthancID, modification, deletes, removePrivateTags, keepSource)
                onHide()
                break
            default:
                toast.error("Wrong level")
        }
        if (jobAnswer !== '') {
            let id = jobAnswer.ID
            let jobMonitoring = new MonitorJob(id)

            jobMonitoring.onUpdate(function (progress) {
                updateToast(id, progress)
            })

            jobMonitoring.onFinish(function (state) {
                if (state === MonitorJob.Success) {
                    successToast(id)
                    refresh()
                } else if (state === MonitorJob.Failure) {
                    failToast(id)
                }
            })
            setToasts(...toasts,
                [id] = createRef())
            openToast(id)
            jobMonitoring.startMonitoringJob()
        }
    }

    const onHide = () => {
        setShow(false)
    }

    if (hidden) return <></>
    return (
        <Fragment>
            <Button className='dropdown-item bg-orange' onClick={openModify}>Modify</Button>
            <ModalModify
                show={show}
                onHide={() => setShow(false)}
                data={data}
                level={level}
                defaultCheckedPrivateTags={removePrivateTags}
                onClickPrivateTags={() => setRemovePrivateTags(!removePrivateTags)}
                defaultCheckedKeepSource={keepSource}
                onClickKeepSource={() => setKeepSource(!keepSource)}
                onClickRemember={() => setRemember(!remember)}
                onDataUpdate={handleDataChange}
                modify={() => modify()}
            />
        </Fragment>
    )

}