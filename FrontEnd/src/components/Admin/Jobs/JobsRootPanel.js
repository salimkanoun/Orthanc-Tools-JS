import React, { Fragment, useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { toast } from "react-toastify";
import apis from "../../../services/apis";
import { useCustomQuery } from "../../CommonComponents/ReactQuery/hooks";
import JobsTableV8 from "./JobsTableV8";


export default ({ }) => {

    const [intervalChecker, setIntervalChecker] = useState(null)
    const [showDetail, setShowDetail] = useState(false)
    const [currentRowIndex, setCurrentRowIndex] = useState('')

    useEffect(()=>{
        startRefreshMonitoring()
    }, [])

    useEffect(()=>{
        return stopRefreshMonitoring()
    })

    const startRefreshMonitoring = () => {
        let intervalChecker = setInterval(() => {
        }, 2000)
        setIntervalChecker(intervalChecker)
    }

    const stopRefreshMonitoring = () => {
        clearInterval(intervalChecker)
    }

    const {data : jobs, isLoading : isLoadingJobs } = useCustomQuery(
        ['jobs'],
        () => apis.jobs.getJobs(),
        undefined,
        (jobsDetails) => { 
            return jobsDetails.map((jobsDetails) => {
                return ({
                    ...jobsDetails
                })
            })
        }
    )

    const dropDown = (id) => {
        return (
            <Dropdown className="text-center">
                <Dropdown.Toggle variant="button-dropdown-blue" id="dropdown-basic" className="button-dropdown button-dropdown-green">
                    Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
    
                    <Dropdown.Item className='bg-green' onClick={async () => {
                        await apis.jobs.resumbitJob(id).catch(error => toast.error(error.statusText, {data:{type:'notification'}}));
                        //getJobs()
                    }}>Resumbit</Dropdown.Item>
    
                    <Dropdown.Item className='bg-blue' onClick={async () => {
                        await apis.jobs.resumeJob(id).catch(error => toast.error(error.statusText, {data:{type:'notification'}}));
                        //getJobs()
                    }}>Resume</Dropdown.Item>
    
                    <Dropdown.Item className='bg-orange' onClick={async () => {
                        await apis.jobs.pauseJob(id).catch(error => toast.error(error.statusText, {data:{type:'notification'}}));
                        //getJobs()
                    }}>Pause</Dropdown.Item>
    
                    <Dropdown.Item className='bg-red' onClick={async () => {
                        await apis.jobs.cancelJob(id).catch(error => toast.error(error.statusText, {data:{type:'notification'}}));
                        //getJobs()
                    }}>Cancel</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    if (isLoadingJobs) return "Loading Jobs"


    return (
        <Fragment>
            <h2 className="card-title mb-4">Jobs</h2>
            <JobsTableV8 rows={jobs} dropDown={dropDown} />
        </Fragment>
    );
}