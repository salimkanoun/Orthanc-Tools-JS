import { useMemo, useRef, useState } from "react";

import { useNotificationCenter } from "react-toastify/addons/use-notification-center";
import { Badge, Overlay } from "react-bootstrap";

import MailIcon from "@mui/icons-material/Mail";
import { IconButton } from "@mui/material";

import JobsRoot from "./Jobs/JobsRoot";

export default () => {

    const {
        notifications,
        remove
    } = useNotificationCenter();

    const jobNotifications = useMemo(() => {
            return notifications.filter((notification) => notification.type === 'jobs')
    }, [notifications.length])
    
    const [isOpen, setIsOpen] = useState(false);

    const target = useRef(null)

    return (
        <div>
            <IconButton size="large" onClick={() => setIsOpen((opened) => !opened)} ref={target}>
                <Badge>
                    <MailIcon color="action" />
                    <span className='button-count'>
                        {jobNotifications.length}
                    </span>
                </Badge>
            </IconButton>

            <Overlay
                target={target.current}
                show={isOpen}
                placement="left"
            >
                <div >
                    <JobsRoot notifications={jobNotifications} remove={remove} />
                </div>
            </Overlay>
        </div>
    );
}