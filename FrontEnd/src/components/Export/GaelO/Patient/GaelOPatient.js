import React, { useEffect, useMemo, useState } from "react";
import { Form, Row } from "react-bootstrap";
import Select from "react-select";
import apis from "../../../../services/apis";

export default ({ investigatorTree }) => {
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
      let details = await apis.gaelo.getPatient("");
    };
  }, [selectedPatient]);

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
    </>
  );
};
