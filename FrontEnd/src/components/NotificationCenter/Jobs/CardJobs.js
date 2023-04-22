import React from "react";

import { Button, Card } from "react-bootstrap";

import JobsTable from "./JobsTable";

export default ({ jobs, clear }) => {

    return (
            <Card>
                <Card.Title>Jobs</Card.Title>
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