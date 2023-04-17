import React, { Fragment, useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import CardJobs from "./CardJobs"
import CardNotifications from "./CardNotifications"

export default ({ notifications, remove }) => {

    const [notificationsArray, setNotificationsArray] = useState([])
    const [jobsArray, setJobsArray] = useState([])

    //TODO faire la mise à jour des jobs
    useEffect(() => {
        let notificationsCards = notifications.map((notification) => {
            if (notification.data.type == 'notification') {
                return notification;
            }
        }).filter(notUndefined => notUndefined !== undefined);
        let jobsCards = notifications.map((notification) => {
            if (notification.data.type == 'jobs') {
                return notification;
            }
        }).filter(notUndefined => notUndefined !== undefined);
        setNotificationsArray(notificationsCards)
        setJobsArray(jobsCards)
    }, [notifications])


    const clearNotifications = () => {
        notifications.map(notification => {
            if (notification.data.type == 'notification') {
                remove(notification.id)
            }
        })
    }

    const clearJobs = () => {
        notifications.map(notification => {
            if (notification.data.type == 'jobs') {
                remove(notification.id)
            }
        })
    }

    return (
        <Fragment >
            <Card >
                <Card.Header>Notification Center</Card.Header>
                <CardJobs jobs={jobsArray} clear={clearJobs} remove={remove}/>
                <CardNotifications notifications={notificationsArray} clear={clearNotifications} remove={remove}/>
            </Card>
        </Fragment>
    )
}