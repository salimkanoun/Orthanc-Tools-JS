import React, { useEffect, useMemo, useState } from "react";
import apis from "../../../services/apis";
import { Button, Container, Row } from "react-bootstrap";
import InstancePreview from "./InstancePreview";

export default ({ orthancSeriesID }) => {
  const [seriesDescription, setSeriesDescription] = useState("")
  const [instanceIDs, setInstanceIDs] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(15)

  useEffect(() => {
    const getInstances = async () => {
      if (orthancSeriesID == null) return;
      let seriesDetails = await apis.content.getSeriesDetails(orthancSeriesID)
      setSeriesDescription(seriesDetails.MainDicomTags?.SeriesDescription?? "None")
      let answer = await apis.content.getSeriesInstances(orthancSeriesID);
      const instances = answer
        .sort(
          (instanceA, instanceB) =>
            instanceA.IndexInSeries - instanceB.IndexInSeries
        )
        .map((instance) => instance.ID);
      setInstanceIDs(instances);
    };
    getInstances();
  }, [orthancSeriesID]);

  const instanceComponents = useMemo(() => {
    let components = [];
    for (let i = pageSize * page; i < pageSize * page + pageSize; i++) {
      console.log(i)
      if (!instanceIDs[i]) break;
      components.push(
        <InstancePreview
          key={instanceIDs[i]}
          orthancInstanceID={instanceIDs[i]}
        />
      );
    }
    return components;
  }, [instanceIDs, page]);

  return (
    <div>
      <Container fluid>
        <Row className="text-center">
          <p>{seriesDescription}</p>
        </Row>
        <Row className="row-cols-5 g-0">{instanceComponents}</Row>
        <Row>
          <Button
            onClick={() => setPage((page) => --page)}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage((page) => ++page)}
            disabled={page === Math.floor(instanceIDs.length / pageSize)}
          >
            Next
          </Button>
        </Row>
      </Container>
    </div>
  );
};
