import React from "react";
import { Row, Col } from 'react-bootstrap'

export default ({ onAnonClick, onExportClick, onDeleteClick }) => {

    return (
        <Row className="text-center mt-5">
            <Col>
                <input type="button" className="otjs-button otjs-button-blue w-10" value="To Anonymize" onClick={onAnonClick} />
            </Col>
            <Col>
                <input type="button" className="otjs-button otjs-button-blue w-10" value="To Export" onClick={onExportClick} />
            </Col>
            <Col>
                <input type="button" className="otjs-button otjs-button-blue w-10" value="To Delete" onClick={onDeleteClick} />
            </Col>
        </Row>
    )

}