import React, { useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal } from "react-bootstrap";

import Spinner from "../../CommonComponents/Spinner";
import LabelsTable from "./LabelsTable";

import { useCustomMutation, useCustomQuery } from "../../CommonComponents/ReactQuery/hooks";
import { keys } from "../../../model/Constant";
import apis from "../../../services/apis";
import RoleSelect from "./RoleSelect";

export default () => {

    const [roleManagement, setRoleManagement] = useState(null)

    const [createLabel, setCreateLabel] = useState('')

    const { data: labels, isLoading } = useCustomQuery(
        [keys.LABELS_KEY],
        () => apis.label.getAllLabels()
    )

    const handleManageRole = (label) => {
        setRoleManagement(label);
    }

    const createLabels = useCustomMutation(
        ({ name }) => apis.label.createLabels(name),
        [[keys.LABELS_KEY]],
        () => setCreateLabel('')
    )

    const handleCreateSubmit = (event) => {
        event.preventDefault();
        if (createLabel.length < 1) return;
        createLabels.mutate({ name: createLabel })
    }

    const handleCreateInput = (event) => {
        setCreateLabel(event.target.value)
    }

    if (isLoading) return <Spinner />

    console.log(labels)
    return (
        <>
            <h2 className="card-title">Labels</h2>
            <Modal
                show={roleManagement != null}
                onHide={() => setRoleManagement(null)}
                backdrop="static"
                keyboard={true}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{`${roleManagement} label roles  `}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RoleSelect />
                </Modal.Body>
            </Modal>
            <Form onSubmitCapture={handleCreateSubmit} className="mt-4">
                <InputGroup>
                    <InputGroup.Text>New</InputGroup.Text>
                    <FormControl placeholder={"label"} type={'text'} onChange={handleCreateInput}
                        value={createLabel} />
                    <Button variant={"outline-primary"} type={"submit"}> + </Button>
                </InputGroup>
            </Form>
            <LabelsTable labels={labels} handlerManageRole={handleManageRole} />
        </>
    )
}
