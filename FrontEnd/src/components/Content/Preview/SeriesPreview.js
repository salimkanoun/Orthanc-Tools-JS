import React, { useEffect, useState } from "react";
import apis from "../../../services/apis";
import { Container } from "react-bootstrap";
import InstancePreview from "./InstancePreview";

export default ({ orthancSeriesID }) => {
  const [instanceIDs, setInstanceIDs] = useState([]);

  useEffect(() => {
    const getInstances = async () => {
      if (orthancSeriesID == null) return;
      let seriesDetails = await apis.content.getSeriesDetails(orthancSeriesID);
      const instances = seriesDetails.Instances;
      setInstanceIDs(instances);
    };
    getInstances();
  }, [orthancSeriesID]);

  return (
    <div>
      <Container fluid>
        {instanceIDs.map((instanceID) => (
          <InstancePreview orthancInstanceID={instanceID} />
        ))}
      </Container>
    </div>
  );
};
