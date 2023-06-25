import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import Select from "react-select";
import apis from "../../../../services/apis";
import GaelOContext from "../../Context/GaelOContext";
import PatientTable from "./PatientTable";

export default ({ investigatorTree }) => {
  const gaeloContext = useContext(GaelOContext);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState({});

  const patientOptions = useMemo(() => {
    if (investigatorTree?.patients == null) return [];
    let patientArray = Object.values(investigatorTree.patients);
    return patientArray.map((patient) => ({
      value: patient.id,
      label: patient.code,
    }));
  }, [investigatorTree]);

  useEffect(() => {
    const getPatientDetails = async () => {
      if (selectedPatient == null) return;
      let details = await apis.gaelo.getPatient(
        gaeloContext.token,
        gaeloContext.studyName,
        selectedPatient.value,
        "Investigator"
      );
      console.log(details);
      setPatientDetails(details);
    };
    getPatientDetails();
  }, [selectedPatient]);

  const patientRows = useMemo(() => {
    let data = [];

    if (Object.keys(patientDetails).length > 0) {
      data.push({
        source: "GaelO",
        firstname: patientDetails.firstname,
        lastname: patientDetails.lastname,
        gender: patientDetails.gender,
      });
    }
    return data;
  }, [patientDetails]);

  const goToHandle = () => {
    let url =
      "https://36c8f2f1-066c-4fd8-a405-ece21ef33e99.pub.instances.scw.cloud/study/" +
      gaeloContext.studyName +
      "/role/Investigator/patient/" +
      selectedPatient.value +
      "?userId=" +
      gaeloContext.userId +
      "&token=" +
      gaeloContext.token;
    window.open(url, "_blank").focus();
  };

  return (
    <>
      <Row>
        <Form.Label>Select Patient</Form.Label>
        <Select
          options={patientOptions}
          value={selectedPatient}
          onChange={(option) => setSelectedPatient(option)}
        />
      </Row>
      <Row>
        <PatientTable data={patientRows} />
      </Row>
      <Row className="d-flex justify-content-center">
        <Button onClick={goToHandle}>Ready, Go to GaelO</Button>
      </Row>
    </>
  );
};
