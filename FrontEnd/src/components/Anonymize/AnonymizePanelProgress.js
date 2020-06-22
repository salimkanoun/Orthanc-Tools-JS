import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';
import { connect } from 'react-redux';
import TableStudy from '../CommonComponents/RessourcesDisplay/TableStudy';
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import apis from '../../services/apis';

import { addToAnonymizedList } from '../../actions/AnonList'


class AnonymizePanelProgress extends Component {

    state = { 
            show: false, 
            success: 0, 
            failures: 0, 
            total: 0
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
            robot = await apis.anon.getAnonJob()
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
                <div style={{width: '15%'}}>
                    <CircularProgressbarWithChildren
                    value={this.state.success}
                    strokeWidth={20}
                    width={10}
                    styles={buildStyles({
                    trailColor: "transparent"
                    })}
                >
                    {/*
                    Width here needs to be (100 - 2 * strokeWidth)% 
                    in order to fit exactly inside the outer progressbar.
                    */}
                    <div style={{ width: "60%" }}>
                    <CircularProgressbar
                        value={this.state.failures}
                        styles={buildStyles({
                        pathColor: "#f00",
                        trailColor: "transparent"
                        })}
                    />
                    </div>
                </CircularProgressbarWithChildren>
                </div>
                

                <button type='button' className='btn btn-info float-right mr-2' onClick={()=>this.setModal()} >Show Details</button>
                <button type='button' className='btn btn-danger float-right mr-2' onClick={()=>alert('not implemented yet')} >Delete</button>
                <button type='button' className='btn btn-primary float-right mr-2' onClick={()=>alert('not implemented yet')} >Resume</button>
                <button type='button' className='btn btn-warning float-right mr-2' onClick={()=>alert('not implemented yet')} >Pause</button>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        anonymizedList: state.AnonList.anonymizedList
    }
}

const mapsDispatchToProps = {
    addToAnonymizedList
}

export default connect(mapStateToProps, mapsDispatchToProps)(AnonymizePanelProgress)