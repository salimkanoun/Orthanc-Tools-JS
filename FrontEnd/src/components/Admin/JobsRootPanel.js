import React, { Component, Fragment } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import apis from "../../services/apis";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";


class JobsRootPanel extends Component {

    constructor(props) {
        super(props);
        this.getJobs = this.getJobs.bind(this)
        this.startRefreshMonitoring = this.startRefreshMonitoring.bind(this)
        this.stopRefreshMonitoring = this.stopRefreshMonitoring.bind(this)
    }

    state = { 
        data: [], 
        rows: [], 
        showDetail: false, 
        currentID: ''
    }

    componentDidMount(){
        this.getJobs()
        this.startRefreshMonitoring()
    }

    componentWillUnmount(){
        this.stopRefreshMonitoring()
    }

    startRefreshMonitoring(){
        this.intervalChcker = setInterval(() => {this.getJobs()}, 2000)
    }

    stopRefreshMonitoring () {
        clearInterval(this.intervalChcker)
    }

    async getJobs(){
        let ID = await apis.jobs.getJobsID()
        let data = []
        for (let i in ID){
            data[ID[i]] = await apis.jobs.getJobInfos(ID[i])
        }
        this.setState({data: data})
        let rows = []
        for (let id in data){
            rows.push({
                ...data[id]
            })
        }
        this.setState({rows: rows})
    }

    dropDown(id){
        return (
            <Dropdown>
                <Dropdown.Toggle variant='success' >
                    Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <button className='dropdown-item bg-danger' onClick={async () => {await apis.jobs.cancelJob(id); this.getJobs()}}>Cancel</button> 
                    <button className='dropdown-item bg-warning' onClick={async () => {await apis.jobs.pauseJob(id); this.getJobs()}}>Pause</button>
                    <button className='dropdown-item bg-primary' onClick={async () => {await apis.jobs.resumbitJob(id); this.getJobs()}}>Resumbit</button>
                    <button className='dropdown-item bg-info' onClick={async () => {await apis.jobs.resumeJob(id); this.getJobs()}}>Resume</button>
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    columnDetails = [
        {
            dataField: 'ID', 
            hidden: true
        }, {
            dataField: 'ErrorCode', 
            text: 'Error Code'
        }, 
        {
            dataField: 'ErrorDescription', 
            text: 'Error Description'
        }, {
            dataField: 'Priority', 
            text: 'Priority'
        }, {
            dataField: 'Type', 
            text: 'Type'
        }, {
            dataField: 'EffectiveRuntime', 
            text: 'Effective Runtime'
        }, {
            dataField: 'Content', 
            text: 'Details', 
            formatter: (cell, row, index) => {
                return (
                    <pre>
                        {JSON.stringify(row.Content , null, 2)}
                    </pre>
                )
            }
        }
    ]

    column = [
        {
            dataField: 'ID', 
            text: 'ID', 
            sort: true
        }, {
            dataField: 'Progress',
            text: 'Progress', 
            sort: true
        }, {
            dataField: 'State',
            text: 'State', 
            sort: true
        }, {
            dataField: 'Details', 
            text: 'Details', 
            formatter: ( (value, row, index) => {
                return <button className='btn btn-info' type='button' onClick={() => this.setState({showDetail: true, currentID: row.ID})}>Details</button>
            })
        }, {
            dataField: 'Actions', 
            text: 'Actions', 
            formatter: ( (value, row, index) => {
                return this.dropDown(row.ID)
            })
        }
    ]



    render() {
        return (
            <Fragment>
                <h2 className="card-title">Jobs</h2>
                <Modal show={this.state.showDetail} onHide={() => this.setState({showDetail: false})} size='xl'>
                    <Modal.Header closeButton>
                        <Modal.Title>Job Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            <BootstrapTable keyField='ID' data={[this.state.data[this.state.currentID]]} columns={this.columnDetails} striped={true} wrapperClasses="table-responsive" />
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' className='btn btn-primary' onClick={()=>this.setState({showDetail: false})}>Close</button>
                    </Modal.Footer>
                </Modal>
                <BootstrapTable keyField='ID' striped={true} data={this.state.rows} columns={this.column} pagination={paginationFactory()}/>
            </Fragment>
        );
    }
}

export default JobsRootPanel;