import React from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from 'react-redux'
import RoleSelect from "./RoleSelect";

export default ({ label, username, handlerManageRole }) => {

    const store = useSelector(state => {
        return {
            username: state.OrthancTools.username
        }
    })

    return (
        <Modal
            show={
                !!label
            }
            onHide={() => handlerManageRole(null)}
            backdrop="static"
            keyboard={true}
        >
            <Modal.Header closeButton>
                <Modal.Title>{`${label} label roles  `}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <RoleSelect label={label} username={username} />
            </Modal.Body>
        </Modal>)
}