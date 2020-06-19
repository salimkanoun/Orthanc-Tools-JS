import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';
import { connect } from 'react-redux';
import TableStudy from '../CommonComponents/RessourcesDisplay/TableStudy';
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import apis from '../../services/apis';

import { addToAnonymizedList } from '../../actions/AnonList'


class AnonymizePanelProgress extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            show: false, 
            success: 0, 
            failures: 0, 
            total: 0
         }
    }

    setModal(){
        this.setState({
            show: !this.state.show
        })
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

    getSuccess(){
        let success = 0
        this.props.robot.items.forEach(async (item) => {
            if (item.Status === 'Success') {
                success = success + 1

                //add to anonimyzed list
                let studyDetail = await apis.content.getStudiesDetails(item.setAnonymizedOrthancStudyID)
                if (studyDetail !== undefined)
                    this.props.addToAnonymizedList([studyDetail])
            }
        })
        return 100*success/this.props.robot.items.length
    }

    getFailures(){
        let failures = 0
        this.props.robot.items.forEach(item => {
            if (item.Status === 'Failure') 
                failures = failures + 1 
        })
        return 100*failures/this.props.robot.items.length
    }

    render() {
        let nbSuccess = this.getSuccess()
        let nbFail = this.getFailures()
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
                    value={nbSuccess}
                    strokeWidth={20}
                    width={10}
                    styles={buildStyles({
                    pathColor: "#f00",
                    trailColor: "transparent"
                    })}
                >
                    {/*
                    Width here needs to be (100 - 2 * strokeWidth)% 
                    in order to fit exactly inside the outer progressbar.
                    */}
                    <div style={{ width: "60%" }}>
                    <CircularProgressbar
                        value={nbFail}
                        styles={buildStyles({
                        trailColor: "transparent"
                        })}
                    />
                    </div>
                </CircularProgressbarWithChildren>
                </div>
                

                <button type='button' className='btn btn-info float-right' onClick={()=>this.setModal()} >Show Details</button>
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