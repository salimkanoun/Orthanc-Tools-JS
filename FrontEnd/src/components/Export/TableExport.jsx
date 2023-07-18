import React from "react";
import TableStudies from "../CommonComponents/RessourcesDisplay/ReactTableV8/TableStudies";

export default ({ studies, currentStudy, onRowClick }) => {
  const rowStyle = (StudyOrthancID) => {
    if (StudyOrthancID === currentStudy) return { background: "peachPuff" };
  };

  return (
    <TableStudies
      studies={studies}
      onRowClick={onRowClick}
      rowStyle={rowStyle}
      withPatientColums
      paginated
    />
  );
};
