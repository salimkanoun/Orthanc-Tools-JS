import React from "react";
import apis from "../../../services/apis";
import { Button, Container, Row } from "react-bootstrap";
import SeriesPreview from "./SeriesPreview";
import {
  useCustomMutation,
  useCustomQuery,
} from "../../../services/ReactQuery/hooks";
import { keys } from "../../../model/Constant";
import Spinner from "../../CommonComponents/Spinner";
import { errorMessage } from "../../../tools/toastify";

export default ({ studyOrthancID }) => {
  const {
    data: seriesOrthancIDs,
    isLoading,
    isError,
  } = useCustomQuery(
    [keys.STUDY_KEY, studyOrthancID],
    () => apis.content.getSeriesDetailsOfStudy(studyOrthancID),
    undefined,
    (answer) => answer.map((study) => study.ID)
  );

  const deleteSeriesMutation = useCustomMutation(
    ({ seriesOrthancID }) => apis.content.deleteSeries(seriesOrthancID),
    [keys.STUDY_KEY, studyOrthancID],
    (error) => {
      errorMessage(error?.data.errorMessage ?? "Failed");
    }
  );

  if (isLoading) return <Spinner />;
  if (isError) return "No Series";

  return (
    <div>
      <Container fluid>
        {seriesOrthancIDs?.map((id) => (
          <Row key={id}>
            <Row>
              <SeriesPreview orthancSeriesID={id} />
            </Row>
            <Row>
              <Button
                variant="danger"
                onClick={() =>
                  deleteSeriesMutation.mutate({ seriesOrthancID: id })
                }
              >
                Delete Series
              </Button>
            </Row>
          </Row>
        ))}
      </Container>
    </div>
  );
};
