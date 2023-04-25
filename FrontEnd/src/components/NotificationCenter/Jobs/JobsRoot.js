import React, { useEffect } from "react"

import { toast } from 'react-toastify'

import CardJobs from "./CardJobs"
import apis from "../../../services/apis";

export default ({ jobNotifications, remove }) => {

    const monitorJobs = async (notifications) => {
        let jobsNotifications = notifications.filter((notification) => notification.data?.State !== 'Success' && notification.data?.State !== 'Failure')
        for (let i = 0; i < Math.min(6, jobsNotifications.length); i++) {
            let updatedData = JSON.parse(JSON.stringify(jobsNotifications[i].data))
            const jobId = jobsNotifications[i]?.data?.ID
            const jobData = await apis.jobs.getJobInfos(jobId)
            updatedData.State = jobData.State
            toast.update(jobsNotifications[i].id, { data: updatedData })
        }
    }

    useEffect(() => {
        monitorJobs()
        const intervalID = setInterval(() => {
            monitorJobs(jobNotifications)
        }, 2000)
        return () => {
            clearInterval(intervalID)
        }
    }, [jobNotifications])

    const clearJobs = () => {
        jobNotifications.map(notification => {
            remove(notification.id)
        })
    }

    return (
        <CardJobs title={"Orthanc Jobs"} jobs={jobNotifications} clear={clearJobs} />
    )
}