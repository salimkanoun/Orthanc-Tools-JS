import React, {Component, Fragment} from "react"
import {connect} from 'react-redux'

import TableStudy from "../CommonComponents/RessourcesDisplay/ReactTable/TableStudy"
import apis from "../../services/apis"
import task from "../../services/task"
import MonitorTask from "../../tools/MonitorTask"
import { Row, Col } from "react-bootstrap"

import {addStudiesToDeleteList} from "../../actions/DeleteList"
import {addStudiesToExportList} from "../../actions/ExportList"


class AnonymizedResults extends Component {

    state = {
        studies: []
    }

    componentDidMount = async () => {
        if (this.props.anonTaskID) {
            let anonTask = await task.getTask(this.props.anonTaskID);
            if (!!anonTask) {
                this.handleTask(anonTask);
                if (!["completed", "failed"].includes(anonTask.state)) {
                    this.monitor = new MonitorTask(this.props.anonTaskID, 4000);
                    this.monitor.onUpdate(this.handleTask.bind(this));
                    this.monitor.onFinish(() => {
                    });
                    this.monitor.startMonitoringJob();
                }
            }
        }
    }

    componentWillUnmount = () => {
        if (this.monitor) this.monitor.stopMonitoringJob();
    }

    handleTask = async anonTask => {
        let studies = []
        for (const item of anonTask.details.items) {
            if (item.state === "completed") {
                try {
                    let study = await apis.content.getStudiesDetails(item.result)
                    let originalStudy = await apis.content.getStudiesDetails(study.AnonymizedFrom)
                    studies.push({
                        ...study,
                        ...study.MainDicomTags,
                        ...study.PatientMainDicomTags,
                        StudyOrthancID: study.ID,
                        AnonymizedFrom: study.AnonymizedFrom,
                        OriginalPatientName: originalStudy.PatientMainDicomTags.PatientName,
                        OriginalPatientID: originalStudy.PatientMainDicomTags.PatientID,
                        OriginalAccessionNumber: originalStudy.MainDicomTags.AccessionNumber,
                        OriginalStudyDate: originalStudy.MainDicomTags.StudyDate,
                        OriginalStudyInstanceUID: originalStudy.MainDicomTags.StudyInstanceUID,
                        OriginalStudyDescription: originalStudy.MainDicomTags.StudyDescription,
                        newStudyDescription: study.MainDicomTags.newStudyDescription ? study.MainDicomTags.newStudyDescription : '',
                        newAccessionNumber: study.MainDicomTags.newAccessionNumber ? study.MainDicomTags.newAccessionNumber : ''
                    })
                } catch (err) {
                }

            }
        }
        this.setState({
            studies
        });
    }

    getCSV = () => {
        //Level study ou series
        //Get le anonymized from pour le level study
    }

    removeStudyAnonymized = (studyID) => {
        apis.content.deleteStudies(studyID)
    }

    exportList = () => {
        this.props.addStudiesToExportList(this.state.studies)
    }

    deleteList = () => {
        this.props.addStudiesToDeleteList(this.state.studies)
    }

    render = () => {
        return (
            <Fragment>
                <Row>
                    <Col>
                        <TableStudy
                            studies={this.state.studies}
                            hiddenActionBouton={true}
                            hiddenRemoveRow={false}
                            onDelete={this.removeStudyAnonymized}
                            hiddenName={false}
                            hiddenID={false}
                            pagination={true}
                            hiddenCSV={false}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center">
                        <button type='button' className='otjs-button otjs-button-blue w-10 me-4' onClick={this.exportList}>
                            To Export List
                        </button>
                        <button type='button' className='otjs-button otjs-button-red w-10 ms-4' onClick={this.deleteList}>
                            To Delete List
                        </button>
                    </Col>
                </Row>
            </Fragment>
        )
    }
}

const mapDispatchToProps = {
    addStudiesToDeleteList,
    addStudiesToExportList
}

export default connect(null, mapDispatchToProps)(AnonymizedResults)