import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import GaelOLogin from "./GaelOLogin";
import GaelOPatient from "./Patient/GaelOPatient";
import GaelOContextProvider from "../Context/GaelOContextProvider";
import GaelORole from "./GaelORole";

export default () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentStudy, setCurrentStudy] = useState(null);
  const [investigatorTree, setInvestigatorTree] = useState({});

  const onTreeHandler = (studyName, tree) => {
    setCurrentStudy(studyName);
    setInvestigatorTree(tree);
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
            <Row>
              <GaelOPatient investigatorTree={investigatorTree} />
            </Row>
          ) : null}
        </Container>
      </GaelOContextProvider>
    </div>
  );
};
