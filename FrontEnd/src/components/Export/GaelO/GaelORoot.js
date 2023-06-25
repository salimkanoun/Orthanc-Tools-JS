import React, { useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import GaelOLogin from "./GaelOLogin";
import GaelOPatient from "./Patient/GaelOPatient";
import GaelOContextProvider from "./Context/GaelOContextProvider";
import GaelORole from "./GaelORole";
import SeriesTable from "./Series/SeriesTable";
import apis from "../../../services/apis";

export default ({ study, series }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentStudy, setCurrentStudy] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [investigatorTree, setInvestigatorTree] = useState({});
  const [selectedSeries, setSelectedSeries] = useState(series);

  const onTreeHandler = (studyName, tree) => {
    setCurrentStudy(studyName);
    setInvestigatorTree(tree);
  };

  const goToHandle = () => {
    try{
      let seriesOrthancIds = selectedSeries.map(series => series.SeriesOrthancID)
      apis.exportDicom.exportHirachicalDicoms(seriesOrthancIds)
    }catch(error){
      console.log("Error Preparing DICOM archive")
    }
    let url =
      "https://36c8f2f1-066c-4fd8-a405-ece21ef33e99.pub.instances.scw.cloud/study/" +
      currentStudy +
      "/role/Investigator/patient/" +
      selectedPatient.value +
      "?userId=" +
      userId +
      "&token=" +
      token;
    window.open(url, "_blank").focus();
  };

  return (
    <div>
      <GaelOContextProvider
        studyName={currentStudy}
        userId={userId}
        token={token}
      >
        <Container fluid>
          {!token ? (
            <Row>
              <GaelOLogin
                onAccessToken={(id, newToken) => {
                  setToken(newToken);
                  setUserId(id);
                }}
              />
            </Row>
          ) : null}
          {token ? (
            <Row>
              <GaelORole onTreeChange={onTreeHandler} />
            </Row>
          ) : null}
          {Object.keys(investigatorTree).length > 0 ? (
            <>
              <Row>
                <GaelOPatient
                  study={study}
                  selectedPatient={selectedPatient}
                  onChangePatient={(patientId) => setSelectedPatient(patientId)}
                  investigatorTree={investigatorTree}
                />
              </Row>
              <Row>
                <SeriesTable series={selectedSeries} />
              </Row>
              <Row className="d-flex justify-content-center">
                <Button onClick={goToHandle}>Download dicom and open GaelO</Button>
              </Row>
            </>
          ) : null}
        </Container>
      </GaelOContextProvider>
    </div>
  );
};
