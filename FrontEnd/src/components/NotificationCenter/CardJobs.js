import React from "react";

import { Button, Card } from "react-bootstrap";

import JobsTable from "./Jobs/JobsTable";

export default ({ title, jobs, clear }) => {

    return (
        <Card>
            <Card.Title>{title}</Card.Title>
            <Card.Body>
                {
                    jobs.length > 0 ?
                        <JobsTable jobs={jobs} />
                        :
                        null
                }
            </Card.Body>
            <Button variant="primary" onClick={clear}>
                Clear All
            </Button>
        </Card>
    )
}