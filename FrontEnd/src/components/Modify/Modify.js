import React, { Component, Fragment, createRef } from 'react'
import apis from '../../services/apis';
import { toastifyError } from '../../services/toastify';
import { toast } from 'react-toastify';

import MonitorJob from '../../tools/MonitorJob'
import ModalModify from './ModalModify';


class Modify extends Component {
    state = { 
        show: false, 
        modification: {}, 
        toasts: {}, 
        keepSource: apis.localStorage.getLocalStorage('remember') === 'true' ? apis.localStorage.getLocalStorage('keepSource') === 'true' : false, 
        removePrivateTags: apis.localStorage.getLocalStorage('remember') === 'true' ? apis.localStorage.getLocalStorage('removePrivateTags') === 'true' : false, 
     }

     constructor(props){
        super(props)
        this.openModify = this.openModify.bind(this)
        this.onHide = this.onHide.bind(this)
        this.afterSaveCell = this.afterSaveCell.bind(this)
    }

    updateToast(id, progress){
        toast.update(this.state.toasts[id].current, {type: toast.TYPE.INFO, autoClose: false, render: 'Modify progress : ' + progress + '%'})
    }

    successToast(id){
        toast.update(this.state.toasts[id].current, {type: toast.TYPE.INFO, autoClose: 5000, render: 'Modify Done',  className: 'bg-success'})
    }

    failToast(id){
        toast.update(this.state.toasts[id].current, {type: toast.TYPE.INFO, autoClose: 5000, render: 'Modify fail', className:'bg-danger'})
    }

    openToast(id){
        this.setState(prevState => ({
            toasts: {...prevState.toasts, [id]: {current: toast("Notify progress : 0%", {autoClose: false, className: 'bg-info'})}}
        }))
    }

     openModify() {
        this.setState({modification: {}, show: true})
        let rows=[]
        let forbidden = ['studies', 'OtherPatientIDs', 'Instances', 'StudyOrthancID', 'PatientOrthancID', 'SeriesOrthancID', 'StudyID', 'SeriesInstanceUID', 'StudyInstanceUID']
        for (let tag in this.props.row){
            if (!forbidden.includes(tag))
                rows.push({'TagName': tag, 'Value': this.props.row[tag] ? this.props.row[tag] : ''})
        }
        this.setState({data: rows})
    }

    checkRemember(){
        apis.localStorage.setlocalStorage('keepSource', this.state.keepSource)
        apis.localStorage.setlocalStorage('removePrivateTags', this.state.removePrivateTags)

        this.setState({
            removePrivateTags: apis.localStorage.getLocalStorage('removePrivateTags') === 'true', 
            keepSource: apis.localStorage.getLocalStorage('keepSource') === 'true'
        })
    }    
    async modify(){
        this.checkRemember()
        //If no change done, simply return
        if(Object.keys(this.state.modification).length === 0)  {
            toastifyError('No Modification set')
            return
        }

        let jobAnswer = ''
        switch(this.props.level){
            case 'patients':
                if (!this.state.modification.PatientID || this.state.modification.PatientID === '')
                    alert('PatientID can\'t be empty or the same as before!')
                else {
                    jobAnswer = await apis.content.modifyPatients(this.props.orthancID, this.state.modification, this.node.selectionContext.selected, this.state.removePrivateTags, this.state.keepSource)
                    this.onHide()
                }
                break
            case 'studies':
                jobAnswer = await apis.content.modifyStudy(this.props.orthancID, this.state.modification, this.node.selectionContext.selected, this.state.removePrivateTags, this.state.keepSource)
                this.onHide()
                break
            case 'series':
                jobAnswer = await apis.content.modifySeries(this.props.orthancID, this.state.modification, this.node.selectionContext.selected, this.state.removePrivateTags, this.state.keepSource)
                this.onHide()
                break
            default:
                toastifyError("Wrong level")
        }
        if (jobAnswer !== ''){
            let id = jobAnswer.ID
            let jobMonitoring = new MonitorJob(id)
            let self = this
            jobMonitoring.onUpdate(function (progress) {
                self.updateToast(id, progress)
            })

            jobMonitoring.onFinish(function (state){
                if(state === MonitorJob.Success){
                    self.successToast(id)
                    self.props.refresh()
                }else if (state === MonitorJob.Failure){
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

    onHide(){
        this.setState({
            show: false
        })
    }

    afterSaveCell(oldValue, newValue, row, column){
        this.setState(prevState => ({
            modification: {
                ...prevState.modification, 
                [row.TagName]: row.Value
            }
        }))
    }

    render() {
        return (
            <Fragment>
                <button className='dropdown-item bg-warning' type='button' onClick={ this.openModify } >Modify</button>
                <ModalModify 
                    reference={n => this.node = n}
                    show={this.state.show} 
                    onHide={() => this.setState({show: false})} 
                    data={this.state.data} 
                    level={this.props.level} 
                    afterSaveCell={this.afterSaveCell} 
                    defaultCheckedPrivateTags={this.state.removePrivateTags}
                    onClickPrivateTags={() => this.setState(prevState => ({removePrivateTags: !prevState.removePrivateTags}))}
                    defaultCheckedKeepSource={this.state.keepSource}
                    onClickKeepSource={() => this.setState(prevState => ({keepSource: !prevState.keepSource}))}
                    onClickRemember={() => this.setState(prevState => ({remember: !prevState.remember}))}
                    modify={() => this.modify()}
                />
            </Fragment>
        );
    }
}

export default Modify;