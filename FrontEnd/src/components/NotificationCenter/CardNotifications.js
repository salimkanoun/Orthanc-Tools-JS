import React, { Fragment } from "react";
import { Alert, Button, Card } from "react-bootstrap";

export default ({ notifications, clear, remove }) => {

    //TODO remove individuel ne fonctionne pas pour le moment 
    return (
        <Fragment >
            <Card>
                <Card.Title>Notifications</Card.Title>
                <Card.Body>
                    {
                        (!notifications.length) && (
                            <h4>
                                Your queue is empty! you are all set{" "}
                                <span role="img" aria-label="dunno what to put">
                                    🎉
                                </span>
                            </h4>
                        )}
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