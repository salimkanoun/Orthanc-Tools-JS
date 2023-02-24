import React, { useEffect, useState } from "react";
import LabelsTable from "./LabelsTable";
import apis from "../../../services/apis";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import RoleManagementModal from "./RoleManagementModal";
import { useCustomMutation, useCustomQuery } from "../../CommonComponents/ReactQuery/hooks";
import { keys } from "../../../model/Constant";
import Spinner from "../../CommonComponents/Spinner";

export default () => {

    const [roleManagement, setRoleManagement] = useState(null)
    const [search, setSearch] = useState('')
    const [createLabel, setCreateLabel] = useState('')

    const { data: filteredLabel, isLoading } = useCustomQuery(
        [keys.LABELS_KEY],
        () => apis.label.getAllLabels(),
        undefined,
        (answer) => {
            return answer.filter(label => label.label_name.includes(search))
        }
    )

    const handleManageRole = (label) => {
        setRoleManagement(label);
    }

    const handleSearch = (event) => {
        setSearch(event.target.value)
    }

    const createLabels = useCustomMutation(
        ({ createLabel }) => {
            apis.label.createLabels(createLabel)
            setCreateLabel('')
        },
        [[keys.LABELS_KEY]]
    )

    const handleCreateSubmit = (event) => {
        event.preventDefault();
        if (createLabel.length < 1) return;
        createLabels.mutate(createLabel)
    }

    const handleCreateInput = (event) => {
        setCreateLabel(event.target.value)
    }

    if (isLoading) return <Spinner/>

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
            <LabelsTable labels={filteredLabel} handlerManageRole={handleManageRole} />
        </>
    )
}
