import React from "react";

import CardJobs from "../CardJobs";

export default ({ jobNotifications = [], remove }) => {

  const clearJobs = () => {
    jobNotifications.map((notification) => {
      remove(notification.id);
    });
  };

  return (
    <CardJobs title="Orthanc Jobs" jobs={jobNotifications} clear={clearJobs} />
  );
};
