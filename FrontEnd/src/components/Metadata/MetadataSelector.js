import React from "react"
import { Col, Container, FormControl, Row, Table } from "react-bootstrap"
import Toggle from 'react-toggle'

export default ({ currentInstanceNumber, numberOfInstances, useSharedTags, onInstanceNumberChange, onSharedTagsChange }) => {
    return (
        <Container fluid>
            <Table>
                <tr>
                    <td>
                        <label>
                            <Toggle checked={useSharedTags} onChange={() => onSharedTagsChange()} />
                            <span> Shared tags </span>
                        </label>
                    </td>
                    <td>
                        <Row>
                            Number of instances : {numberOfInstances}
                        </Row>
                        {
                            useSharedTags ?
                                null :
                                <Row>
                                    <FormControl type="number" min={1} max={numberOfInstances} value={currentInstanceNumber + 1} onChange={(event) => {
                                        let value = event.target.value
                                        onInstanceNumberChange(Number(value) - 1)
                                    }
                                    } />
                                </Row>
                        }
                    </td>
                </tr>
            </Table>
        </Container>
    )
}