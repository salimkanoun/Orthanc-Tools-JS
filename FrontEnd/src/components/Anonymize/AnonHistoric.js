import React, {Component, useMemo} from 'react'
import {toast} from 'react-toastify';
import {connect} from 'react-redux'
import apis from '../../services/apis';
import AnonymizedResults from './AnonymizedResults';
import task from '../../services/task';
import {Modal} from "react-bootstrap";
import {addStudiesToDeleteList} from "../../actions/DeleteList";
import {addStudiesToExportList} from "../../actions/ExportList";
import CommonTable from "../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

function HistoricTable({tasks, deleteJobHandler, setSelectedTask}) {
    const columns = useMemo(() => [{
        accessor: 'id',
        Header: 'id'
    }, {
        accessor: 'queriesNb',
        Header: 'Number of Queries'
    }, {
        accessor: 'state',
        Header: 'State'
    }, {
        id: 'details',
        Header: 'Show Details',
        Cell: ({row}) => {
            return (<div className="text-center">
                <input type="button" className='otjs-button otjs-button-green w-10'
                       onClick={() => setSelectedTask(row.values.id)}
                       value="Show Result"/>
            </div>)
        }
    }, {
        id: 'remove',
        Header: 'Remove Robot',
        Cell: ({row}) => {
            return (
                <div className="text-center">
                    <input type="button" className='otjs-button otjs-button-red w-10'
                           onClick={() => deleteJobHandler(row.id)}
                           value="Remove Job"/>
                </div>
            )
        }
    }], [deleteJobHandler, setSelectedTask]);

    const data = useMemo(() => tasks, [tasks]);

    return <CommonTable columns={columns} tableData={data}/>
}

class AnonHistoric extends Component {

    state = {
        selectedTask: null,
        rows: []
    }

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
            await this.refreshHandler()
        } catch (error) {
            toast.error(error.statusText)
        }
    }

    refreshHandler = () => {
        apis.task.getTaskOfUser(this.props.username, 'anonymize')
            .then(async taksIds => await Promise.all(taksIds.map(id => task.getTask(id))))
            .then((answerData) => {
                this.setState({
                    rows: answerData.map(robotJob => ({
                        id: robotJob.id,
                        username: robotJob.creator,
                        state: robotJob.state,
                        queriesNb: robotJob.details.items.length
                    }))
                })

            }).catch(error => {
            console.log(error)
            if (error.status === 404) {
                toast.error(error.statusMessage);
            }
        })
    }

    render = () => {
        return (
            <>
                <Modal dialogClassName={"big-modal"} show={!!this.state.selectedTask}
                       onHide={() => this.setState({selectedTask: null})} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Anonymize Result</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.selectedTask ?
                            <AnonymizedResults anonTaskID={this.state.selectedTask}/> :
                            null
                        }
                    </Modal.Body>
                </Modal>
                <HistoricTable tasks={this.state.rows} deleteJobHandler={this.deleteJobHandler}
                               setSelectedTask={selectedTask => {
                                   this.setState({selectedTask});
                               }}/>
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