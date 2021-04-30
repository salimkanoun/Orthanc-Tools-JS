import React, {Component} from "react"

import TableStudy from "../CommonComponents/RessourcesDisplay/TableStudy"
import apis from "../../services/apis"
import task from "../../services/task"
import MonitorTask from "../../tools/MonitorTask"


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
                    let study = (await apis.content.getStudiesDetails(item.result));
                    studies.push({
                        StudyOrthancID: study.ID,
                        ...study.MainDicomTags,
                        ...study.PatientMainDicomTags,
                        AnonymizedFrom: study.AnonymizedFrom,
                        newStudyDescription: study.MainDicomTags.newStudyDescription ? study.MainDicomTags.newStudyDescription : '',
                        newAccessionNumber: study.MainDicomTags.newAccessionNumber ? study.MainDicomTags.newAccessionNumber : ''
                    });
                } catch (err) {
                    if (!err.statusCode === 404) {
                        throw err;
                    }
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
            <div className='jumbotron'>
                <h2 className='card-title mb-3'>Anonymized studies</h2>
                <div className='row'>
                    <div className='col-sm mb-3'>
                        <button type='button' className="btn btn-warning float-right"
                                onClick={this.emptyAnonymizedList}>Empty List
                        </button>
                        <TableStudy
                            data={this.state.studies}
                            hiddenActionBouton={true}
                            hiddenRemoveRow={false}
                            onDelete={this.removeStudyAnonymized}
                            hiddenName={false}
                            hiddenID={false}
                            pagination={true}
                            hiddenCSV={false}
                        />
                    </div>
                </div>
                <div className='text-center'>
                    <button type='button' className='btn btn-primary mr-3' onClick={this.exportList}>To Export List
                    </button>
                    <button type='button' className='btn btn-danger' onClick={this.deleteList}>To Delete List</button>
                </div>
            </div>
        )
    }
}

export default AnonymizedResults