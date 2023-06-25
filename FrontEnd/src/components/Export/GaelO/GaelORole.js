import React, { useContext, useEffect, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import apis from "../../../services/apis";
import { errorMessage } from "../../../tools/toastify";
import GaelOContext from "../Context/GaelOContext";

export default ({ onTreeChange }) => {
  const gaelOContext = useContext(GaelOContext);
  const [studies, setStudies] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState(null);

  useEffect(() => {
    const getStudies = async () => {
      try {
        const studies = await apis.gaelo.getStudiesFromUser(
          gaelOContext.token,
          gaelOContext.userId
        );
        setStudies(studies);
      } catch (error) {
        errorMessage("Error fetching studies");
      }
    };

    getStudies();
  }, []);

  useEffect(() => {
    const getRoles = async () => {
      const studyName = selectedStudy.value;
      try {
        const roles = await apis.gaelo.getRoles(
          gaelOContext.token,
          gaelOContext.userId,
          studyName
        );
        if (roles.includes("Investigator")) {
          let visits = await apis.gaelo.getVisitsTree(
            gaelOContext.token,
            studyName,
            "Investigator"
          );
          onTreeChange(studyName, visits);
        } else {
          errorMessage("No investigator role for this study");
        }
      } catch (error) {
        errorMessage("Error fetching visits");
      }
    };

    if (selectedStudy) getRoles();
  }, [selectedStudy]);

  const studiesOptions = useMemo(() => {
    return studies.map((study) => ({
      label: study,
      value: study,
    }));
  }, [studies]);

  return (
    <>
      <Form.Label>Select Study : </Form.Label>
      <Select
        options={studiesOptions}
        value={selectedStudy}
        onChange={(option) => setSelectedStudy(option)}
      />
    </>
  );
};
