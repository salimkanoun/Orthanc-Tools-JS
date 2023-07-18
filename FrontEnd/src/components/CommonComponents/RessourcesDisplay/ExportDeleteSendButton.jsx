import React from "react";
import { Row, Col, Container, Button } from "react-bootstrap";

export default ({ onAnonClick, onExportClick, onDeleteClick }) => {
  return (
    <Container fluid>
      <Row className="text-center mt-5">
        <Col>
          <Button
            className="otjs-button otjs-button-blue w-10"
            disabled={onAnonClick === undefined}
            onClick={onAnonClick}
          >
            To Anonymize
          </Button>
        </Col>
        <Col>
          <Button
            className="otjs-button otjs-button-blue w-10"
            disabled={onExportClick === undefined}
            onClick={onExportClick}
          >
            To Export
          </Button>
        </Col>
        <Col>
          <Button
            className="otjs-button otjs-button-blue w-10"
            disabled={onDeleteClick === undefined}
            onClick={onDeleteClick}
          >
            To Delete
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
