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
        this.state = { 
            data: [], 
            rows: [], 
            showDetail: false, 
            currentID: ''
        }
    }

    componentWillMount(){
        this.getJobs()
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
        console.log(rows)
        this.setState({rows: rows})
    }

    getDetails(){
        let str = JSON.stringify(this.state.data[this.state.currentID], null, 2)
        return str
    }

    dropDown(id){
        return (
            <Dropdown>
                <Dropdown.Toggle variant='success' >
                    Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {/*Les APIS ne s'éxécute pas*/}
                    <button className='dropdown-item bg-danger' onClick={async () => await apis.jobs.cancelJob(id)}>Cancel</button> 
                    <button className='dropdown-item bg-warning' onClick={async () => await apis.jobs.pauseJob(id)}>Pause</button>
                    <button className='dropdown-item bg-primary' onClick={async () => await apis.jobs.resumbitJob(id)}>Resumbit</button>
                    <button className='dropdown-item bg-info' onClick={async () => await apis.jobs.resumeJob(id)}>Resume</button>
                </Dropdown.Menu>
            </Dropdown>
        )
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
                <Modal show={this.state.showDetail} onHide={() => this.setState({showDetail: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Job Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.getDetails()} {/*A modifier et rajouter une table*/}
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