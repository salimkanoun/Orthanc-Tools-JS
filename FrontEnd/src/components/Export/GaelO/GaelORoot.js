import React, { useEffect, useRef, useState } from "react";
import { Container, Row } from "react-bootstrap";
import GaelOLogin from "./GaelOLogin";
import apis from "../../../services/apis";

export default () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [studies, setStudies] = useState([]);

  useEffect(() => {
    const getStudies = async () => {
      const studies = await apis.gaelo.getStudiesFromUser(token, userId);
      console.log(studies);
      apis.gaelo.getRoles(token, userId);
    };

    //SK declange un logout si fail
    if (token && userId) getStudies();
  }, [token]);

  useEffect(() => {
    const getRoles = async () => {
      const roles = await apis.gaelo.getRoles(token, userId);
      console.log(roles);
    };
    //SK declange un logout si fail
    if (token && userId) getRoles();
  }, [studies.length]);

  return (
    <div>
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
      </Container>
    </div>
  );
};
