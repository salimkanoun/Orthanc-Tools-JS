import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { toast } from "react-toastify";

import apis from "../../../services/apis";
import { useCustomQuery } from "../../CommonComponents/ReactQuery/hooks";
import JobsTableV8 from "./JobsTableV8";
import { keys } from "../../../model/Constant";


export default () => {

    const {data : jobs, isLoading : isLoadingJobs } = useCustomQuery(
        [keys.JOBS_KEY],
        () => apis.jobs.getJobs(),
        undefined,
        undefined,
        undefined,
        2000
    )

    const onResubmitJob = (jobId) => {
        apis.jobs.resumbitJob(jobId).catch(error => toast.error(error.statusText, {data:{type:'notification'}}));
    }

    const onResumeJob = (jobId) => {
        apis.jobs.resumeJob(jobId).catch(error => toast.error(error.statusText, {data:{type:'notification'}}))
    }

    const dropDown = (id) => {
        return (
            <Dropdown className="text-center">
                <Dropdown.Toggle variant="button-dropdown-blue" id="dropdown-basic" className="button-dropdown button-dropdown-green">
                    Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item className='bg-green' onClick={() => onResubmitJob(id) }>Resumbit</Dropdown.Item>
    
                    <Dropdown.Item className='bg-blue' onClick={() => onResumeJob(id)}>Resume</Dropdown.Item>
    
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

    if (isLoadingJobs) return "Loading ..."


    return (
        <>
            <h2 className="card-title mb-4">Jobs</h2>
            <JobsTableV8 rows={jobs} dropDown={dropDown} />
        </>
    );
}