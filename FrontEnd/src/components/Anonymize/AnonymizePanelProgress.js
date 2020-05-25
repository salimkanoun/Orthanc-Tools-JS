import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';
import { connect } from 'react-redux';
import TableStudy from '../CommonComponents/RessourcesDisplay/TableStudy';
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'


class AnonymizePanelProgress extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            show: false
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
                    value={100}
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
                        value={100}
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

export default connect(mapStateToProps)(AnonymizePanelProgress)