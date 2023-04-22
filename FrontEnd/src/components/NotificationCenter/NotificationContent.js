import React, { useEffect } from "react"

import { toast } from 'react-toastify'
import { Card } from "react-bootstrap"

import CardJobs from "./CardJobs"
import apis from "../../services/apis";

export default ({ notifications, remove }) => {

    const monitorJobs = async (notifications) => {
        let jobsNotifications = notifications.filter((notification) => notification.type === 'jobs' && notification.data?.State !== 'Success' && notification.data?.State !== 'Failure')
        for (let i = 0; i < Math.min(6, jobsNotifications.length); i++) {
            let updatedData = JSON.parse(JSON.stringify(jobsNotifications[i].data))
            const jobId = jobsNotifications[i]?.data?.ID
            const jobData = await apis.jobs.getJobInfos(jobId)
            updatedData.State = jobData.State
            toast.update(jobsNotifications[i].id, { data: updatedData })
        }
    }

    useEffect(() => {
        const intervalID = setInterval(() => {
            monitorJobs(notifications)
        }, 2000)
        return () => {
            clearInterval(intervalID)
        }
    }, [notifications])

    const clearJobs = () => {
        notifications.map(notification => {
            if (notification.type == 'jobs') {
                remove(notification.id)
            }
        })
    }

    return (
        <Card >
            <Card.Header>Notification Center</Card.Header>
            <Card.Body>
                <CardJobs jobs={notifications} clear={clearJobs} />
            </Card.Body>
        </Card>
    )
}