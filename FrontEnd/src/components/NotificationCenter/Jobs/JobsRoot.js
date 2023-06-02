import React, { useCallback, useEffect } from "react";

import { toast } from "react-toastify";

import CardJobs from "../CardJobs";
import apis from "../../../services/apis";

export default ({ jobNotifications = [], remove }) => {
  console.log(jobNotifications);

  let pendingJobs = jobNotifications.filter(
    (notification) =>
      notification.data?.State !== "Success" &&
      notification.data?.State !== "Failure"
  );

  const monitorJobs = async () => {

    for (const notifications of pendingJobs) {
      let updatedData = JSON.parse(JSON.stringify(notifications.data));
      const jobId = updatedData.ID;
      const jobData = await apis.jobs.getJobInfos(jobId);
      updatedData.State = jobData.State;
      toast.update(notifications.id, { data: updatedData });
    }
  };

  useEffect(() => {
    monitorJobs();
    const intervalID = setInterval(monitorJobs, 2000);
    return () => {
      clearInterval(intervalID);
    };
  }, []);

  const clearJobs = () => {
    jobNotifications.map((notification) => {
      remove(notification.id);
    });
  };

  return (
    <CardJobs title="Orthanc Jobs" jobs={jobNotifications} clear={clearJobs} />
  );
};
