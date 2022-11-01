import React, { Fragment, useMemo, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { toast } from "react-toastify";

import apis from "../../../services/apis";
import ModalDetails from './ModalDetails'
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";
import { Button } from "react-bootstrap";

const dropDown = (id) => {
    return (
        <Dropdown className="text-center">
            <Dropdown.Toggle variant="button-dropdown-blue" id="dropdown-basic" className="button-dropdown button-dropdown-green">
                Actions
            </Dropdown.Toggle>
            <Dropdown.Menu>

                <Dropdown.Item className='bg-green' onClick={async () => {
                    await apis.jobs.resumbitJob(id).catch(error => toast.error(error.statusText));
                    this.getJobs()
                }}>Resumbit</Dropdown.Item>

                <Dropdown.Item className='bg-blue' onClick={async () => {
                    await apis.jobs.resumeJob(id).catch(error => toast.error(error.statusText));
                    this.getJobs()
                }}>Resume</Dropdown.Item>

                <Dropdown.Item className='bg-orange' onClick={async () => {
                    await apis.jobs.pauseJob(id).catch(error => toast.error(error.statusText));
                    this.getJobs()
                }}>Pause</Dropdown.Item>

                <Dropdown.Item className='bg-red' onClick={async () => {
                    await apis.jobs.cancelJob(id).catch(error => toast.error(error.statusText));
                    this.getJobs()
                }}>Cancel</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

function JobsTable({ handleDetails, rows }) {
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
            Cell: (({ row }) => {
                return (<div className="text-center"><Button className='otjs-button otjs-button-blue'
                    onClick={() => handleDetails(row.index)}>Details</Button></div>)
            })
        }, {
            accessor: 'Actions',
            Header: 'Actions',
            Cell: (({ row }) => {
                return dropDown(row.values.ID)
            })
        }
    ], [handleDetails]);
    const data = useMemo(() => rows, [rows]);
    return <CommonTable data={data} columns={columns} />

}

export default ({ }) => {

    const [rows, setRows] = useState([])
    const [showDetail, setShowDetail] = useState(false)
    const [currentRowIndex, setCurrentRowIndex] = useState('')

    const componentDidMount = () => {
        getJobs()
        startRefreshMonitoring()
    }

    const componentWillUnmount = () => {
        stopRefreshMonitoring()
    }

    const startRefreshMonitoring = () => {
        this.intervalChcker = setInterval(() => {
            getJobs()
        }, 2000)
    }

    const stopRefreshMonitoring = () => {
        clearInterval(this.intervalChcker)
    }

    const handleDetails = (index) => {
        setShowDetail(true)
        setCurrentRowIndex(index)
    }

    const getJobs = async () => {

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

        setRows(rows)
    }


    return (
        <Fragment>
            <h2 className="card-title mb-4">Jobs</h2>
            <ModalDetails show={showDetail} onHide={() => setShowDetail(false)}
                data={[rows[currentRowIndex]]} />
            <JobsTable handleDetails={handleDetails} rows={rows} />
        </Fragment>
    );
}