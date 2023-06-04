import React, { useCallback, useEffect } from "react";

import { toast } from "react-toastify";

import CardJobs from "../CardJobs";
import apis from "../../../services/apis";

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
