import React from "react";
import CommonTableV8 from "../../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ data = [] }) => {
  const columns = [
    {
      id: "source",
      accessorKey: "source",
      header: "Source",
    },
    {
      id: "lastname",
      accessorKey: "lastname",
      header: "Lastname",
    },
    {
      id: "firstname",
      accessorKey: "firstname",
      header: "Firstname",
    },
    {
      id: "gender",
      accessorKey: "gender",
      header: "gender",
    },
  ];
  return <CommonTableV8 columns={columns} data={data} />;
};
