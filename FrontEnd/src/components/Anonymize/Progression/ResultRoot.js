import React from 'react'
import { Col, Row } from 'react-bootstrap'
import AnonymizedResults from './AnonymizedResults'
import AnonymizePanelProgress from './AnonymizePanelProgress'

export default ({anonTaskID}) => {
    return (
        <Row className="align-items-center justify-content-center">
        <Col md={12} className="text-center mb-4" style={{ "max-width": '20%' }}>
            <AnonymizePanelProgress anonTaskID={anonTaskID} />
        </Col>
        <Col md={12}>
            <AnonymizedResults anonTaskID={anonTaskID} />
        </Col>
    </Row>
    )
}