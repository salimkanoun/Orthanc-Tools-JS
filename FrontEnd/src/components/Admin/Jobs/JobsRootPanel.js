import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

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

    if (isLoadingJobs) return "Loading ..."


    return (
        <>
            <h2 className="card-title mb-4">Jobs</h2>
            <JobsTableV8 rows={jobs} />
        </>
    );
}