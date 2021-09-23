import React, { Component } from "react";
import {Row, Col} from 'react-bootstrap'

export default class AnonExportDeleteSendButton extends Component {

    render = () => {
        return (
            <Row className="text-center mt-5">
                <Col>
                    <input type="button" className="otjs-button otjs-button-blue w-10" value="To Anonymize" onClick={this.props.onAnonClick} />
                </Col>
                <Col>
                    <input type="button" className="otjs-button otjs-button-blue w-10" value="To Export" onClick={this.props.onExportClick} />
                </Col>
                <Col>
                    <input type="button" className="otjs-button otjs-button-blue w-10" value="To Delete" onClick={this.props.onDeleteClick} />
                </Col>
            </Row>
        )
    }
}