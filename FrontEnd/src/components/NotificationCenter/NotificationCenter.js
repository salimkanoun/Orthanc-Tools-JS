import { useMemo, useRef, useState } from "react";

import { useNotificationCenter } from "react-toastify/addons/use-notification-center";
import { Badge, Card, Overlay } from "react-bootstrap";

import MailIcon from "@mui/icons-material/Mail";
import { IconButton } from "@mui/material";

import JobsRoot from "./Jobs/JobsRoot";
import TasksRoot from "./Tasks/TasksRoot";

export default () => {

    const {
        notifications,
        remove
    } = useNotificationCenter();

    const [isOpen, setIsOpen] = useState(false);
    const target = useRef(null)

    return (
        <div>
            <IconButton size="large" onClick={() => setIsOpen((opened) => !opened)} ref={target}>
                <Badge>
                    <MailIcon color="action" />
                    <span className='button-count'>
                        {notifications.length}
                    </span>
                </Badge>
            </IconButton>

            <Overlay
                target={target.current}
                show={isOpen}
                placement="left"
            >
                <Card >
                    <Card.Header>Notifications</Card.Header>
                    <Card.Body>
                        <JobsRoot jobNotifications={notifications.filter((notification) => notification.type === 'jobs')} remove={remove} />
                        <TasksRoot tasksNotifications={notifications.filter((notification) => notification.type === 'tasks')} remove={remove} />
                    </Card.Body>
                </Card>
            </Overlay >
        </div >
    );
}