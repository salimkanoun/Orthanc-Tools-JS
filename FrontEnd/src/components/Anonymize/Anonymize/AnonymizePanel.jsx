import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Container, Row } from "react-bootstrap";

import apis from "../../../services/apis";
import AnonProfile from "./AnonProfile";

import { autoFill, emptyAnonymizeList } from "../../../actions/AnonList";
import TableStudyAnonymize from "./TableStudyAnonymize";
import { errorMessage, successMessage } from "../../../tools/toastify";
import TablePatientAnonymize from "./TablePatientAnonymize";

/**
 * This componnent wrapper allows to optimise the table by memoizing data
 * because getStudies return a different object everytime the component state updates
 * @param studies list of the studies
 * @param selectedPatient patient currently selected to show their studies
 * @param props props required by the table
 * @returns {JSX.Element} The table
 */

export default () => {
  const [currentPatient, setCurrentPatient] = useState("");
  const [prefix, setPrefix] = useState("");

  const dispatch = useDispatch();

  const anonList = useSelector((state) => state.AnonList.anonList);
  const profile = useSelector((state) => state.AnonList.profile);
  const username = useSelector((state) => state.OrthancTools.username);

  const studiesData = useMemo(
    () =>
      anonList
        .filter((study) => study.PatientOrthancID === currentPatient)
        .map((study) => ({
          ...study,
          newStudyDescription: study.newStudyDescription
            ? study.newStudyDescription
            : study.StudyDescription,
          newAccessionNumber: study.newAccessionNumber
            ? study.newAccessionNumber
            : "OrthancToolsJS",
        })),
    [JSON.stringify(anonList), currentPatient]
  );

  const testAllId = () => {
    let answer = true;
    anonList.forEach((item) => {
      if (item.ParentPatient.newPatientID === undefined) answer = false;
    });
    return answer;
  };

  const anonymize = async () => {
    if (testAllId()) {
      //check all id
      let listToAnonymize = [];
      anonList.forEach((element) => {
        let anonItem = {
          orthancStudyID: element.StudyOrthancID,
          profile: profile,
          newPatientName: element.ParentPatient.newPatientName,
          newPatientID: element.ParentPatient.newPatientID,
          newStudyDescription: element.newStudyDescription
            ? element.newStudyDescription
            : element.StudyDescription,
          newAccessionNumber: element.newAccessionNumber
            ? element.newAccessionNumber
            : "OrthancToolsJS",
        };

        listToAnonymize.push(anonItem);
      });

      try {
        await apis.anon.createAnonRobot(
          listToAnonymize,
          username
        ); //wait for the robot's answer to know what do to next
        successMessage("Anonymization started");
      } catch (error) {
        errorMessage(error.statusText);
      }
    } else {
      errorMessage("Fill all patient ID");
    }
  };

  const rowStyle = (PatientOrthancID) => {
    if (PatientOrthancID === currentPatient) return { background: "peachPuff" };
  };

  const onChangePrefixHandler = (e) => {
    setPrefix(e.target.value);
  };

  const onClickAutoFill = () => {
    dispatch(autoFill(prefix));
  };

  const onClickEmpty = () => {
    dispatch(emptyAnonymizeList());
  };

  return (
    <Container fluid>
      <Row className="mt-5">
        <Col>
          <TablePatientAnonymize
            rowStyle={rowStyle}
            setCurrentPatient={(PatientOrthancID) =>
              setCurrentPatient(PatientOrthancID)
            }
          />

          <Button
            className="otjs-button otjs-button-red mt-2 w-7"
            onClick={onClickEmpty}
          >
            Empty List
          </Button>
        </Col>
        <Col>
          <TableStudyAnonymize studies={studiesData} />
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Row className="align-items-center">
            <Col sm={8}>
              <input
                type="text"
                name="prefix"
                id="prefix"
                className="form-control"
                placeholder="prefix"
                onChange={onChangePrefixHandler}
              />
            </Col>
            <Col sm>
              <Button
                variant="warning"
                className="otjs-button"
                onClick={onClickAutoFill}
              >
                AutoFill
              </Button>
            </Col>
          </Row>
        </Col>
        <Col>
          <AnonProfile />
        </Col>
      </Row>
      <Row className="mt-4 border-top border-2 pt-4">
        <Col className="text-center">
          <Button
            className="otjs-button otjs-button-blue w-7"
            onClick={() => anonymize()}
          >
            Anonymize
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
