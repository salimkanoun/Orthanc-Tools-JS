import React, {Component, createRef, Fragment} from 'react'
import apis from '../../services/apis';
import {toast} from 'react-toastify';

import MonitorJob from '../../tools/MonitorJob'
import ModalModify from './ModalModify';


export default class Modify extends Component {

    state = {
        show: false,
        modification: {},
        deletes: [],
        toasts: {},
        keepSource: localStorage.getItem('remember') === 'true' ? localStorage.getItem('keepSource') === 'true' : false,
        removePrivateTags: localStorage.getItem('remember') === 'true' ? localStorage.getItem('removePrivateTags') === 'true' : false,
    }

    updateToast = (id, progress) => {
        toast.update(this.state.toasts[id].current, {
            type: toast.TYPE.INFO,
            autoClose: false,
            render: 'Modify progress : ' + Math.round(progress) + '%'
        })
    }

    successToast = (id) => {
        toast.update(this.state.toasts[id].current, {
            type: toast.TYPE.INFO,
            autoClose: 5000,
            render: 'Modify Done',
            className: 'bg-success'
        })
    }

    failToast = (id) => {
        toast.update(this.state.toasts[id].current, {
            type: toast.TYPE.INFO,
            autoClose: 5000,
            render: 'Modify fail',
            className: 'bg-danger'
        })
    }

    openToast = (id) => {
        this.setState(prevState => ({
            toasts: {
                ...prevState.toasts,
                [id]: {current: toast("Notify progress : 0%", {autoClose: false, className: 'bg-info'})}
            }
        }))
    }

    openModify = () => {
        this.setState({modification: {}, show: true})
        let rows = []
        let forbidden = ['studies', 'OtherPatientIDs', 'Instances', 'StudyOrthancID', 'PatientOrthancID', 'SeriesOrthancID', 'StudyID', 'SeriesInstanceUID', 'StudyInstanceUID']
        for (let tag in this.props.row) {
            if (!forbidden.includes(tag))
                rows.push(
                    {
                        'TagName': tag,
                        'Value':
                            this.props.row[tag] ?
                                this.props.row[tag] : '',
                        deletable: false
                    })
        }
        this.setState({data: rows})
    }

    checkRemember = () => {
        localStorage.setItem('keepSource', this.state.keepSource)
        localStorage.setItem('removePrivateTags', this.state.removePrivateTags)

        this.setState({
            removePrivateTags: localStorage.getItem('removePrivateTags') === 'true',
            keepSource: localStorage.getItem('keepSource') === 'true'
        })
    }

    handleDataChange = (oldValue, newValue, row, column) => {
        let modification = this.state.modification;
        let deletes = this.state.deletes;
        if (column === 'Value') {
            modification[row.TagName] = newValue;
        } else {
            if (newValue) {
                deletes.push(row.TagName);
            } else {
                deletes = deletes.filter(x => x !== row.TagName);
            }
        }
        const data = this.state.data;
        data.find(x => x.TagName === row.TagName)[column] = newValue;

        this.setState({
            modification,
            data: [...data],
            deletes
        })
    }

    modify = async () => {
        this.checkRemember()
        //If no change done, simply return
        if (Object.keys(this.state.modification).length === 0) {
            toast.error('No Modification set')
            return
        }

        let jobAnswer = ''
        switch (this.props.level) {
            case 'patients':
                if (!this.state.modification.PatientID || this.state.modification.PatientID === '')
                    alert('PatientID can\'t be empty or the same as before!')
                else {
                    jobAnswer = await apis.content.modifyPatients(this.props.orthancID, this.state.modification, this.state.deletes, this.state.removePrivateTags, this.state.keepSource)
                    this.onHide()
                }
                break
            case 'studies':
                jobAnswer = await apis.content.modifyStudy(this.props.orthancID, this.state.modification, this.state.deletes, this.state.removePrivateTags, this.state.keepSource)
                this.onHide()
                break
            case 'series':
                jobAnswer = await apis.content.modifySeries(this.props.orthancID, this.state.modification, this.state.deletes, this.state.removePrivateTags, this.state.keepSource)
                this.onHide()
                break
            default:
                toast.error("Wrong level")
        }
        if (jobAnswer !== '') {
            let id = jobAnswer.ID
            let jobMonitoring = new MonitorJob(id)
            let self = this
            jobMonitoring.onUpdate(function (progress) {
                self.updateToast(id, progress)
            })

            jobMonitoring.onFinish(function (state) {
                if (state === MonitorJob.Success) {
                    self.successToast(id)
                    self.props.refresh()
                } else if (state === MonitorJob.Failure) {
                    self.failToast(id)
                }
                self.job = undefined
            })
            this.setState(prevState => ({toasts: {...prevState.toasts, [id]: createRef()}}))
            this.openToast(id)
            jobMonitoring.startMonitoringJob()
            this.job = jobMonitoring
        }
    }

    onHide = () => {
        this.setState({
            show: false
        })
    }

    afterSaveCell = (oldValue, newValue, row, column) => {
        this.setState(prevState => ({
            modification: {
                ...prevState.modification,
                [row.TagName]: row.Value
            }
        }))
    }

    render = () => {

        var render = <></>
        if (this.props.hidden !== true) {
            render = <Fragment>
                <button className='dropdown-item bg-orange' type='button' onClick={this.openModify}>Modify</button>
                <ModalModify
                    show={this.state.show}
                    onHide={() => this.setState({show: false})}
                    data={this.state.data}
                    level={this.props.level}
                    defaultCheckedPrivateTags={this.state.removePrivateTags}
                    onClickPrivateTags={() => this.setState(prevState => ({removePrivateTags: !prevState.removePrivateTags}))}
                    defaultCheckedKeepSource={this.state.keepSource}
                    onClickKeepSource={() => this.setState(prevState => ({keepSource: !prevState.keepSource}))}
                    onClickRemember={() => this.setState(prevState => ({remember: !prevState.remember}))}
                    onDataUpdate={this.handleDataChange}
                    modify={() => this.modify()}
                />
            </Fragment>
        }
        return render
    }
}