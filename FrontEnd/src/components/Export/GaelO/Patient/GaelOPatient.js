import React, { useContext, useEffect, useMemo, useState } from "react";
import { Form, Row } from "react-bootstrap";
import Select from "react-select";
import apis from "../../../../services/apis";
import GaelOContext from "../Context/GaelOContext";
import PatientTable from "./PatientTable";

export default ({
  study,
  investigatorTree,
  selectedPatient,
  onChangePatient,
}) => {
  const gaeloContext = useContext(GaelOContext);
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
        selectedPatient,
        "Investigator"
      );
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

    data.push({
      source: "Dicom",
      firstname: study.ParentPatient?.PatientName?.split("^")?.[1] ?? "",
      lastname: study.ParentPatient?.PatientName?.split("^")?.[0] ?? "",
      gender: study.ParentPatient?.PatientSex ?? "",
    });

    return data;
  }, [patientDetails]);

  return (
    <>
      <Row>
        <Form.Label>Select Patient</Form.Label>
        <Select
          options={patientOptions}
          value={patientOptions.find(
            (option) => option.value === selectedPatient
          )}
          onChange={(option) => onChangePatient(option.value)}
        />
      </Row>
      {selectedPatient ? (
        <Row>
          <PatientTable data={patientRows} />
        </Row>
      ) : null}
    </>
  );
};
