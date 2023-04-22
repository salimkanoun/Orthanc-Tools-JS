import React, { Fragment } from "react";
import { Alert, Button, Card } from "react-bootstrap";

export default ({ notifications, clear, remove }) => {

    return (
        <Fragment >
            <Card>
                <Card.Title>Notifications</Card.Title>
                <Card.Body>
                    {notifications.map((notification) => {
                        return (
                            <Alert
                                variant={(notification.type) || "info"}
                            >
                                {notification.content}
                                <Button onClick={() => remove(notification.id)}>remove</Button>
                            </Alert>
                        )
                    })}

                </Card.Body>

                <Button variant="primary" onClick={clear}>
                    Clear All
                </Button>

            </Card>
        </Fragment>
    )

}