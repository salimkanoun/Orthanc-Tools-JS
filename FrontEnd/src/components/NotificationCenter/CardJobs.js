import React, { Fragment } from "react";
import { Button, Card } from "react-bootstrap";

export default ({jobs}) => {

    return (
        <Fragment >
            <Card>
                <Card.Title>Jobs</Card.Title>
                <Card.Body>
                    Notification 1 <br />
                    Notification 2 <br />
                </Card.Body>

                <Button variant="primary" onClick={()=>{}}>
                    Clear All
                </Button>
            </Card>
        </Fragment>
    )
}