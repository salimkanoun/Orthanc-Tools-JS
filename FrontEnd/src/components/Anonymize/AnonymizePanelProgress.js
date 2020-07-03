import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';
import { connect } from 'react-redux';
import TableStudy from '../CommonComponents/RessourcesDisplay/TableStudy';
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import apis from '../../services/apis';

import { addToAnonymizedList, emptyAnonymizeList } from '../../actions/AnonList'


class AnonymizePanelProgress extends Component {

    state = { 
            show: false, 
            success: 0, 
            failures: 0
         }
    constructor(props) {
        super(props);
        this.getInfo = this.getInfo.bind(this)
    }

    setModal(){
        this.setState({
            show: !this.state.show
        })
    }
    
    componentDidMount() {
        this.getInfo()
    }

    async getInfo(){
        let robot 
        do {
            let success = 0
            let failures = 0
            robot = await apis.anon.getAnonJob(this.props.username)
            robot.items.forEach(async item => {
                switch (item.Status) {
                    case 'Success':
                        success = success + 1
                        let studyDetail = await apis.content.getStudiesDetails(item.anonymizedOrthancStudyID)
                        if (studyDetail !== undefined)
                            this.props.addToAnonymizedList([studyDetail])
                        break;
                    case 'Failures':
                        failures = failures + 1
                        break;
                    default:
                        break;
                }
            })
            success = 100*success/robot.items.length
            failures = 100*failures/robot.items.length
            this.setState({
                success: success, 
                failures: failures
            })
        } while (robot.status !== 'Finished')
        this.props.emptyAnonymizeList()
        this.props.setProgress(false)
    }
    

    getStudiesAnonymized(){
        let studies = []
        this.props.anonymizedList.forEach(study => {
            studies.push({
                StudyOrthancID: study.ID, 
                ...study.MainDicomTags, 
                ...study.PatientMainDicomTags,
                AnonymizedFrom: study.AnonymizedFrom,
                newStudyDescription: study.MainDicomTags.newStudyDescription ? study.MainDicomTags.newStudyDescription : '', 
                newAccessionNumber: study.MainDicomTags.newAccessionNumber ? study.MainDicomTags.newAccessionNumber : ''
            })
        })
        return studies
    }

    render() {
        let total = this.state.success + this.state.failures
        return (
            <Fragment>
                <Modal show={this.state.show} scrollable={true} onHide={()=>this.setModal()}>
                    <Modal.Header closeButton >
                        <Modal.Title>Progress</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <TableStudy
                                data={this.getStudiesAnonymized()}
                                hiddenActionBouton={true} 
                                onDelete={this.removeStudyAnonymized}
                                hiddenName={false}
                                hiddenID={false}
                                pagination={true}
                                />
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' className='btn btn-primary text-center' onClick={()=>this.setModal()}>Close</button>
                    </Modal.Footer>
                </Modal>
                <div className="col-md-2 text-left">
                    <CircularProgressbarWithChildren
                        value={this.state.success}
                        text={'Progress : ' + total.toFixed(2) + ' %'}
                        styles={buildStyles({
                            textSize: '8px'
                        })}>
                    
                        <CircularProgressbar
                            value={this.state.failures}
                            styles={buildStyles({
                            pathColor: "#f00",
                            trailColor: "transparent"
                            })}
                        />
                    </CircularProgressbarWithChildren>
                </div>

                <button type='button' className='btn btn-info float-right mr-2' onClick={()=>this.setModal()} >Show Details</button>
                <button type='button' className='btn btn-danger float-right mr-2' onClick={()=>alert('not implemented yet')} disabled>Delete</button>
                <button type='button' className='btn btn-primary float-right mr-2' onClick={()=>alert('not implemented yet')} disabled>Resume</button>
                <button type='button' className='btn btn-warning float-right mr-2' onClick={()=>alert('not implemented yet')} disabled>Pause</button>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        anonymizedList: state.AnonList.anonymizedList,
        username: state.OrthancTools.username
    }
}

const mapsDispatchToProps = {
    addToAnonymizedList,
    emptyAnonymizeList
}

export default connect(mapStateToProps, mapsDispatchToProps)(AnonymizePanelProgress)