import React, {Component, Fragment, useMemo} from "react";
import Dropdown from "react-bootstrap/Dropdown";
import {toast} from "react-toastify";

import apis from "../../../services/apis";
import ModalDetails from './ModalDetails'
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

const dropDown = (id) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant='success'>
                Actions
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item className='bg-danger' onClick={async () => {
                    await apis.jobs.cancelJob(id).catch(error => toast.error(error.statusText));
                    this.getJobs()
                }}>Cancel</Dropdown.Item>
                <Dropdown.Item className='bg-warning' onClick={async () => {
                    await apis.jobs.pauseJob(id).catch(error => toast.error(error.statusText));
                    this.getJobs()
                }}>Pause</Dropdown.Item>
                <Dropdown.Item className='bg-primary' onClick={async () => {
                    await apis.jobs.resumbitJob(id).catch(error => toast.error(error.statusText));
                    this.getJobs()
                }}>Resumbit</Dropdown.Item>
                <Dropdown.Item className='bg-info' onClick={async () => {
                    await apis.jobs.resumeJob(id).catch(error => toast.error(error.statusText));
                    this.getJobs()
                }}>Resume</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

function JobsTable({handleDetails, rows}) {
    const columns = useMemo(() => [
        {
            accessor: 'ID',
            Header: 'ID',
            sort: true
        }, {
            accessor: 'Progress',
            Header: 'Progress',
            sort: true
        }, {
            accessor: 'State',
            Header: 'State',
            sort: true
        }, {
            accessor: 'Details',
            Header: 'Details',
            Cell: (({row}) => {
                return <button className='btn btn-info' type='button'
                               onClick={() => handleDetails(row.index)}>Details</button>
            })
        }, {
            accessor: 'Actions',
            Header: 'Actions',
            Cell: (({row}) => {
                return dropDown(row.values.ID)
            })
        }
    ], [handleDetails]);
    const data = useMemo(() => rows, [rows]);
    return <CommonTable tableData={data} columns={columns}/>

}

export default class JobsRootPanel extends Component {

    state = {
        rows: [],
        showDetail: false,
        currentRowIndex: ''
    }

    componentDidMount = () => {
        this.getJobs()
        this.startRefreshMonitoring()
    }

    componentWillUnmount = () => {
        this.stopRefreshMonitoring()
    }

    startRefreshMonitoring = () => {
        this.intervalChcker = setInterval(() => {
            this.getJobs()
        }, 2000)
    }

    stopRefreshMonitoring = () => {
        clearInterval(this.intervalChcker)
    }

    handleDetails = (index) => {
        this.setState({
            showDetail: true,
            currentRowIndex: index
        });
    }

    getJobs = async () => {

        let rows = []

        let jobsDetails

        try {
            jobsDetails = await apis.jobs.getJobs()
        } catch (error) {
            toast.error(error.statusText)
            return rows
        }

        jobsDetails.forEach(jobDetails => {
            rows.push({
                ...jobDetails
            })
        })

        this.setState({rows: rows})
    }


    render = () => {
        return (
            <Fragment>
                <h2 className="card-title">Jobs</h2>
                <ModalDetails show={this.state.showDetail} onHide={() => this.setState({showDetail: false})}
                              data={[this.state.rows[this.state.currentRowIndex]]}/>
                <JobsTable handleDetails={this.handleDetails} rows={this.state.rows}/>
            </Fragment>
        );
    }
}