import React, { Component, Fragment, createRef } from 'react'
import Modal from 'react-bootstrap/Modal';
import apis from '../../services/apis';
import BootstrapTable from 'react-bootstrap-table-next'
import cellEditFactory from 'react-bootstrap-table2-editor'
import { toastifyError } from '../../services/toastify';
import { toast } from 'react-toastify';

import MonitorJob from '../../tools/MonitorJob'


class Modify extends Component {
    state = { 
        show: false, 
        modification: {}, 
        toasts: {}, 
        keepSource: false
     }

     constructor(props){
        super(props)
        this.openModify = this.openModify.bind(this)
        this.onHide = this.onHide.bind(this)
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
        this.setState({
            toasts: {...this.state.toasts, [id]: {current: toast("Notify progress : 0%", {autoClose: false, className: 'bg-info'})}}
        })
    }

     openModify() {
        this.setState({modification: {}, show: true, removePrivateTags: false})
        let rows=[]
        let forbidden = ['studies', 'Instances', 'StudyOrthancID', 'PatientOrthancID', 'SeriesOrthancID', 'StudyID', 'SeriesInstanceUID', 'StudyInstanceUID']
        for (let tag in this.props.row){
            if (!forbidden.includes(tag))
                rows.push({'TagName': tag, 'Value': this.props.row[tag] ? this.props.row[tag] : ''})
        }
        this.setState({data: rows})
    }
    
    async modify(){
        let jobAnswer = ''
        switch(this.props.level){
            case 'patient':
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
                    self.props.refresh ? self.props.refresh() : self.props.refreshSerie()
                }else if (state === MonitorJob.Failure){
                    self.failToast(id)
                }
                self.job = undefined
            })
            this.setState({toasts: {...this.state.toasts, [id]: createRef()}})
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

    handleClick(e){
        e.stopPropagation()
    }

    columns = [
        {
            dataField: 'TagName', 
            text: 'Tag name', 
            sort: true, 
        },  {
            dataField: 'Value', 
            text: 'Value', 
            sort: true, 
        }
    ]

    selectRow = {
        mode: 'checkbox', 
        style: {background: 'red'}, 
        nonSelectable: ['PatientID', 'SeriesTime', 'SeriesDate', 'Modality', 'StudyDate', 'StudyTime'], 
        selectionRenderer: ({ mode, checked, disabled }) => {
            if (disabled) return 'Mendatory'
            else return <input type = 'checkbox'/>
        },
        selectColumnPosition: 'right', 
        selectionHeaderRenderer: () => {return 'Delete'}
    }

    render() {
        return (
            <Fragment>
                <button className='dropdown-item bg-warning' type='button' onClick={ this.openModify } >Modify</button>

                <Modal show={this.state.show} onHide={this.onHide} onClick={this.handleClick} size='xl'>
                    <Modal.Header closeButton>
                        <Modal.Title>Modify {this.props.level}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <BootstrapTable 
                            ref={n => this.node = n}
                            keyField='TagName' 
                            data={this.state.data} 
                            striped={true} 
                            columns={this.columns} 
                            wrapperClasses="table-responsive"
                            cellEdit={ cellEditFactory({ 
                                blurToSave: true,
                                autoSelectText: true,
                                mode: 'click',
                                nonEditableRows: () =>  this.props.level === 'studies' ? ['PatientID'] : [] ,
                                afterSaveCell: (oldValue, newValue, row, column) => {
                                    this.setState({
                                        modification: {
                                            ...this.state.modification, 
                                            [row.TagName]: row.Value
                                        }
                                    })
                                }
                            }) }
                            selectRow={this.selectRow}
                        />
                        <div className='row'>
                            <div className='col-auto'>
                                <label htmlFor='removePrivateTags'>Removing private tags</label>
                            </div>
                            <div className='col-sm'>
                                <input className='form-check-input' type='checkbox' onClick={() => this.setState({removePrivateTags: !this.state.removePrivateTags})} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-auto'>
                                <label htmlFor='keepSource'>Keep Source</label>
                            </div>
                            <div className='col-sm'>
                                <input className='form-check-input' type='checkbox' onClick={() => this.setState({keepSource: !this.state.keepSource})} />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' className='btn btn-info' onClick={this.onHide}>Cancel</button>
                        <button type='button' className='btn btn-warning' onClick={() => this.modify()}>Modify</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        );
    }
}

export default Modify;