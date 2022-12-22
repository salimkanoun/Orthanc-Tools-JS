import React, { Fragment } from "react";
import { Alert, Button, Card } from "react-bootstrap";

export default ({ jobs, remove }) => {

    return (
        <Fragment >
            <Card>
                <Card.Title>Jobs</Card.Title>
                <Card.Body>
                    {
                        (!jobs.length) && (
                            <h4>
                                Your queue is empty! you are all set{" "}
                                <span role="img" aria-label="dunno what to put">
                                    🎉
                                </span>
                            </h4>
                        )}
                    {jobs.map((job) => {
                        return (
                            <Alert
                                variant={(job.type) || "info"}
                            >
                                {job.content}

                                <Button onClick={() => remove(job.id)}>remove</Button>

                            </Alert>
                        )
                    })}

                </Card.Body>

                <Button variant="primary" onClick={remove}>
                    Clear All
                </Button>
            </Card>
        </Fragment>
    )
}