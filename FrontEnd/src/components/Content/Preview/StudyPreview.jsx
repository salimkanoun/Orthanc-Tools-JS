import React, { useEffect, useState } from "react";
import apis from "../../../services/apis";
import { Button, Container, Row } from "react-bootstrap";
import SeriesPreview from "./SeriesPreview";

export default ({ studyOrthancID }) => {
  const [seriesOrthancIDs, setSeriesOrthancIDs] = useState([]);
  useEffect(() => {
    const getSeries = async () => {
      const studiesDetails = await apis.content.getSeriesDetailsOfStudy(
        studyOrthancID
      );
      let ids = studiesDetails.map((study) => study.ID);
      setSeriesOrthancIDs(ids);
    };
    getSeries();
  }, []);

  return (
    <div>
        <Container fluid>
            {
                seriesOrthancIDs.map(id=> (
                    <Row key={id}>
                        <Row>
                        <SeriesPreview orthancSeriesID={id} />
                        </Row>
                        <Row>
                            <Button variant="danger">Delete Series</Button>
                        </Row>
                        
                    </Row>
                ))
            }
        </Container>
    </div>
  );
};
