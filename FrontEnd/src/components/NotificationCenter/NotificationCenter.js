import { useRef, useState } from "react";
import { useNotificationCenter } from "react-toastify/addons/use-notification-center";
import { Badge, Overlay } from "react-bootstrap";

import MailIcon from "@mui/icons-material/Mail";
import { IconButton } from "@mui/material";

import NotificationContent from "./NotificationContent";

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
                <div >
                    <NotificationContent notifications={notifications} remove={remove} />
                </div>
            </Overlay>
        </div>
    );
}