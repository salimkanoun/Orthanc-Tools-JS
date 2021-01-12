import React, { Component, Fragment } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Dropdown from "react-bootstrap/Dropdown";

import apis from "../../../services/apis";
import ModalDetails from './ModalDetails'

class JobsRootPanel extends Component {

    state = { 
        rows: [], 
        showDetail: false, 
        currentRowIndex: ''
    }
    
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
                return <button className='btn btn-info' type='button' onClick={() => this.setState({showDetail: true, currentRowIndex: index})}>Details</button>
            })
        }, {
            dataField: 'Actions', 
            text: 'Actions', 
            formatter: ( (value, row, index) => {
                return this.dropDown(row.ID)
            })
        }
    ]

    componentDidMount = () => {
        this.getJobs()
        this.startRefreshMonitoring()
    }

    componentWillUnmount = () => {
        this.stopRefreshMonitoring()
    }

    startRefreshMonitoring = () => {
        this.intervalChcker = setInterval(() => {this.getJobs()}, 2000)
    }

    stopRefreshMonitoring = () => {
        clearInterval(this.intervalChcker)
    }

    getJobs = async () => {
        let jobsDetails = await apis.jobs.getJobs()

        let rows=[]
        jobsDetails.forEach(jobDetails => {
            rows.push({
                ...jobDetails
            })
        })

        this.setState({rows: rows})
    }

    dropDown = (id) => {
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

    render = () => {
        return (
            <Fragment>
                <h2 className="card-title">Jobs</h2>
                <ModalDetails show={this.state.showDetail} onHide={() => this.setState({showDetail: false})} data={[this.state.rows[this.state.currentRowIndex]]} />
                <BootstrapTable 
                    keyField='ID' 
                    striped={true} 
                    data={this.state.rows} 
                    columns={this.column} 
                    pagination={paginationFactory()}
                    wrapperClasses='table-responsive'
                />
            </Fragment>
        );
    }
}

export default JobsRootPanel;