import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import { toast } from 'react-toastify';
import { connect } from 'react-redux'
import apis from '../../services/apis';
import AnonymizedResults from './AnonymizedResults';
import task from '../../services/task';
import { Modal } from "react-bootstrap";
import { addStudiesToDeleteList } from "../../actions/DeleteList";
import { addStudiesToExportList } from "../../actions/ExportList";

class AnonHistoric extends Component {

    state = {
        selectedTask: null,
        rows: []
    }

    columns = [{
        dataField: 'id',
        text: 'id'

    }, {
        dataField: 'queriesNb',
        text: 'Number of Queries'
    }, {
        dataField: 'state',
        text: 'State'
    }, {
        dataField: 'details',
        text: 'Show Details',
        formatter: (cell, row, rowIndex, parentComponent) => {
            return (<div className="text-center">
                <input type="button" className='btn btn-primary' onClick={() => {
                    this.setState({ selectedTask: row.id })
                }} value="Show Result" />
            </div>)
        }
    }, {
        dataField: 'remove',
        text: 'Remove Robot',
        formatter: (cell, row, rowIndex) => {
            return (
                <div className="text-center">
                    <input type="button" className='btn btn-danger'
                        onClick={() => this.deleteJobHandler(row.id)}
                        value="Remove Job" />
                </div>
            )
        }
    }];


    componentDidMount = () => {
        this.refreshHandler()
        this.startRefreshMonitoring()
    }

    componentWillUnmount = () => {
        this.stopRefreshMonitoring()
    }

    startRefreshMonitoring = () => {
        this.intervalChcker = setInterval(this.refreshHandler, 2000)
    }

    stopRefreshMonitoring = () => {
        clearInterval(this.intervalChcker)
    }

    deleteJobHandler = async (id) => {
        try {
            await apis.retrieveRobot.deleteRobot(id)
            this.refreshHandler()
        } catch (error) {
            toast.error(error.statusText)
        }
    }

    refreshHandler = () => {
        apis.task.getTaskOfUser(this.props.username, 'anonymize')
            .then(async taksIds => await Promise.all(taksIds.map(id => task.getTask(id))))
            .then((answerData) => {
                let rows = []
                answerData.forEach(robotJob => {
                    rows.push({
                        id: robotJob.id,
                        username: robotJob.creator,
                        state: robotJob.state,
                        queriesNb: robotJob.details.items.length
                    })
                });

                this.setState({
                    rows: rows
                })

            }).catch(error => {
                if (error.statusCode === 404) {
                    toast.error(error.statusMessage);
                }
            })
    }

    render = () => {
        return (
            <>
                <Modal dialogClassName={"big-modal"} show={!!this.state.selectedTask}
                    onHide={() => this.setState({ selectedTask: null })} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Anonymize Result</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.selectedTask ?
                            <AnonymizedResults anonTaskID={this.state.selectedTask} /> :
                            null
                        }
                    </Modal.Body>
                </Modal>
                <BootstrapTable keyField="id" striped={true} data={this.state.rows} columns={this.columns}
                    wrapperClasses='table-responsive' />
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.OrthancTools.username
    }
}

const mapDispatchToProps = {
    addStudiesToDeleteList,
    addStudiesToExportList
}

export default connect(mapStateToProps, mapDispatchToProps)(AnonHistoric)