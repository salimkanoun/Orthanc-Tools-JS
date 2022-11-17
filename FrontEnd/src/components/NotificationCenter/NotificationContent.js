import React, { Fragment } from "react"
import { Card } from "react-bootstrap"
import CardJobs from "./CardJobs"
import CardNotifications from "./CardNotifications"

export default ({notifications}) => {
    {console.log("props notification content", notifications)}
    return (
        <Fragment >
            <Card >
                <Card.Header>Notification Center</Card.Header>
                <CardJobs notifications={notifications} />
                <CardNotifications notifications={notifications} />
            </Card>
        </Fragment>
    )
}