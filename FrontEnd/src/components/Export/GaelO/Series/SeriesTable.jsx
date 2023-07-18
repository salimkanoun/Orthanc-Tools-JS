import React from "react";
import TableSeries from "../../../CommonComponents/RessourcesDisplay/ReactTableV8/TableSeries";
import { Button } from "react-bootstrap";

export default ({ series = [], onRemoveSeries }) => {
  const additionalColumns = [
    {
      id: "source",
      header: "Remove",
      cell: ({ row }) => {
        return (
          <Button onClick={() => onRemoveSeries(row.original.SeriesOrthancID)}>
            Remove
          </Button>
        );
      },
    },
  ];

  return <TableSeries series={series} additionalColumns={additionalColumns} />;
};
