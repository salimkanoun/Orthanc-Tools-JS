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
    try {
      let seriesOrthancIds = selectedSeries.map(
        (series) => series.SeriesOrthancID
      );
      apis.exportDicom.exportHirachicalDicoms(seriesOrthancIds);
    } catch (error) {
      console.log("Error Preparing DICOM archive");
    }
    let url =
      "https://platform.gaelo.fr/study/" +
      currentStudy +
      "/role/Investigator/patient/" +
      selectedPatient.value +
      "?userId=" +
      userId +
      "&token=" +
      token;
    window.open(url, "_blank").focus();
  };

  const removeSeriesHandle = (seriesOrthancID) => {
    let filteredSeries = selectedSeries.filter(
      (series) => series.SeriesOrthancID !== seriesOrthancID
    );
    setSelectedSeries(filteredSeries);
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
              <GaelOPatient
                study={study}
                selectedPatient={selectedPatient}
                onChangePatient={(patientId) => setSelectedPatient(patientId)}
                investigatorTree={investigatorTree}
              />
              <Row>
                <SeriesTable
                  series={selectedSeries}
                  onRemoveSeries={removeSeriesHandle}
                />
              </Row>
              <Row className="d-flex justify-content-center">
                <Button
                  disabled={
                    selectedSeries.length == 0 || selectedPatient == null
                  }
                  onClick={goToHandle}
                >
                  Download dicom and open GaelO
                </Button>
              </Row>
            </>
          ) : null}
        </Container>
      </GaelOContextProvider>
    </div>
  );
};
