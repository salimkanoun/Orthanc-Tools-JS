import { useEffect, useRef, useState } from "react";

import { useNotificationCenter } from "react-toastify/addons/use-notification-center";
import { Badge, Card, Overlay } from "react-bootstrap";

import MailIcon from "@mui/icons-material/Mail";

import JobsRoot from "./Jobs/JobsRoot";
import apis from "../../services/apis";

export default () => {
  const { notifications, remove } = useNotificationCenter();

  const [isOpen, setIsOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const target = useRef(null);

  const jobNotifications = notifications.filter(
    (notification) => notification.type === "jobs"
  );

  let pendingJobs = jobNotifications.filter(
    (notification) =>
      notification.data?.State !== "Success" &&
      notification.data?.State !== "Failure"
  );

  useEffect(() => {
    const refreshData = async () => {
      for (const pendingJob of pendingJobs) {
        let updatedData = pendingJob.data;
        const jobId = updatedData.ID;
        const jobData = await apis.jobs.getJobInfos(jobId);
        updatedData.State = jobData.State;
      }
    };

    refreshData();
  }, [lastRefresh]);

  useEffect(() => {
    const interval = setInterval(() => setLastRefresh(Date.now()), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Badge
        bg="info"
        onClick={() => setIsOpen((opened) => !opened)}
        ref={target}
      >
        <MailIcon color="action" />
        <span className="button-count">{jobNotifications.length}</span>
      </Badge>

      <Overlay target={target.current} show={isOpen} placement="left">
        <Card>
          <Card.Header>Notifications</Card.Header>
          <Card.Body>
            <JobsRoot jobNotifications={jobNotifications} remove={remove} />
          </Card.Body>
        </Card>
      </Overlay>
    </div>
  );
};
