import React, { Component, useState } from "react";
import LabelsTable from "./LabelsTable";
import apis from "../../../services/apis";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import RoleManagementModal from "./RoleManagementModal";

export default ({ }) => {

    const [roleManagement, setRoleManagement] = useState(null)
    const [labels, setLabels] = useState({})
    const [search, setSearch] = useState('')
    const [createLabel, setCreateLabel] = useState('')

    const componentDidMount = () => {
        apis.label.getAllLabels().then(labels => {
            setLabels(labels);
        })
    }

    const handleManageRole = (label) => {
        setRoleManagement(label);
    }

    const handlerDelete = (label) => {
        apis.label.deleteLabels(label).then(() => {
            apis.label.getAllLabels().then(labels => {
                setLabels(labels);
            })
        });
    }

    const handleSearch = (event) => {
        setSearch(event.target.value)
    }

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        if (createLabel.length < 1) return;
        return apis.label.createLabels(createLabel).then(() => {
            setCreateLabel('')
            return apis.label.getAllLabels()
        }).then(labels => {
            setLabels(labels)
        });
    }

    const handleCreateInput = (event) => {
        setCreateLabel(event.target.value)
    }

    let filteredLabel = labels.filter(label => label.label_name.includes(search));

    return (
        <>
            <h2 className="card-title">Labels</h2>

            <Form onSubmitCapture={handleCreateSubmit} className="mt-4">
                <InputGroup>
                    <InputGroup.Text>New</InputGroup.Text>
                    <FormControl placeholder={"label"} type={'text'} onChange={handleCreateInput}
                        value={createLabel} />
                    <Button variant={"outline-primary"} type={"submit"}> + </Button>
                </InputGroup>
            </Form>
            <RoleManagementModal label={roleManagement} handlerManageRole={handleManageRole} />


            <InputGroup className="mt-4">
                <InputGroup.Text>Search</InputGroup.Text>
                <FormControl placeholder={"label"} type={'text'} onChange={handleSearch}
                    value={search} />
                <InputGroup.Text>{filteredLabel.length}</InputGroup.Text>
            </InputGroup>
            <LabelsTable labels={filteredLabel} handlerManageRole={handleManageRole}
                handlerDelete={handlerDelete} />


        </>)
}
