import React, { useEffect, useState } from "react"
import { Card } from "react-bootstrap"

import CardJobs from "./CardJobs"
import { useNotificationCenter } from "react-toastify/addons/use-notification-center";
import apis from "../../services/apis";

export default ({ notifications, remove }) => {

    const {
        update
    } = useNotificationCenter();

    const [notificationsArray, setNotificationsArray] = useState([])
    const [jobsArray, setJobsArray] = useState([])

    /*
    //TODO faire la mise à jour des jobs
    useEffect(() => {
        let notificationsCards = notifications.map((notification) => {
            if (notification.type == 'notification') {
                return notification;
            }
        }).filter(notUndefined => notUndefined !== undefined);
        let jobsCards = notifications.map((notification) => {
            if (notification.type == 'jobs') {
                return notification;
            }
        }).filter(notUndefined => notUndefined !== undefined);
        setNotificationsArray(notificationsCards)
        setJobsArray(jobsCards)
    }, [notifications])
*/
    useEffect(() => {
        const intervalID = setInterval(() => {
            monitorJobs()
        }, 2000)
        return () => {
            clearInterval(intervalID)
        }
    }, [])

    const monitorJobs = async () => {
        let jobsNotifications = notifications.filter((notification) => notification.type === 'jobs')
        for (let i = 0; i < Math.min(6, jobsNotifications.length); i++) {
            console.log(jobsNotifications[i])
            const jobId = jobsNotifications[i]?.data?.id
            const jobData = await apis.jobs.getJobInfos(jobId)
            console.log(jobData)
            update(jobsNotifications[i].id, { data: { ...jobsNotifications[i].data, status: jobData.Status } })
        }
    }


    const clearNotifications = () => {
        notifications.map(notification => {
            if (notification.type == 'notification') {
                remove(notification.id)
            }
        })
    }

    const clearJobs = () => {
        notifications.map(notification => {
            if (notification.type == 'jobs') {
                remove(notification.id)
            }
        })
    }

    //<CardNotifications notifications={notificationsArray} clear={clearNotifications} remove={remove} />
    return (
        <Card >
            <Card.Header>Notification Center</Card.Header>
            <Card.Body>
                <CardJobs jobs={jobsArray} clear={clearJobs} onRemove={(id) => remove(id)} />
            </Card.Body>
        </Card>
    )
}