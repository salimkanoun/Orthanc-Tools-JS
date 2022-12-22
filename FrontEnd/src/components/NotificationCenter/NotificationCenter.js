import { useRef, useState } from "react";
import MailIcon from "@mui/icons-material/Mail";

import { useNotificationCenter } from "react-toastify/addons/use-notification-center";
import { Badge,Overlay } from "react-bootstrap";
import { IconButton } from "@mui/material";
import NotificationContent from "./NotificationContent";

export default () => {

    const {
        notifications,
        remove,
        unreadCount
    } = useNotificationCenter();

    const [isOpen, setIsOpen] = useState(false);

    const target = useRef(null)

    const toggleNotificationCenter = (event) => {
        setIsOpen(!isOpen);
    }; 

    return (
        <div>

            <IconButton size="large" onClick={toggleNotificationCenter} ref={target}>
                <Badge badgeContent={unreadCount} color="primary">
                    <MailIcon color="action" />
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