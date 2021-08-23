import React, {Component} from "react";
import LabelsTable from "./LabelsTable";
import apis from "../../../services/apis";
import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import RoleManagementModal from "./RoleManagementModal";

class LabelRootPanel extends Component {

    state = {
        roleManagement: null,
        labels: [],
        search: '',
        createLabel: ''
    }

    componentDidMount() {
        apis.label.getAllLabels().then(labels => {
            this.setState({labels});
        })
    }

    handleManageRole = (label) => {
        this.setState({roleManagement: label});
    }

    handlerDelete = (label) => {
        apis.label.deleteLabels(label).then(() => {
            apis.label.getAllLabels().then(labels => {
                this.setState({labels});
            })
        });
    }

    handleSearch = (event) => {
        this.setState({search: event.target.value})
    }

    handleCreateSubmit = (e) => {
        e.preventDefault();
        if (this.state.createLabel.length < 1) return;
        return apis.label.createLabels(this.state.createLabel).then(() => {
            this.setState({
                createLabel: ''
            });
            return apis.label.getAllLabels()
        }).then(labels => {
            this.setState({labels});
        });
    }

    handleCreateInput = (event) => {
        this.setState({
            createLabel: event.target.value
        })
    }

    render() {
        let filteredLabel = this.state.labels.filter(label => label.label_name.includes(this.state.search));

        return (
        <>
            <h2 className="card-title">Labels</h2>

            <Form onSubmitCapture={this.handleCreateSubmit} className="mt-4">
                <InputGroup>
                    <InputGroup.Text>New</InputGroup.Text>
                    <FormControl placeholder={"label"} type={'text'} onChange={this.handleCreateInput}
                                 value={this.state.createLabel}/>
                    <Button variant={"outline-primary"} type={"submit"}> + </Button>
                </InputGroup>
            </Form>
            <RoleManagementModal label={this.state.roleManagement} handlerManageRole={this.handleManageRole}/>

            
            <InputGroup className="mt-4">
                <InputGroup.Text>Search</InputGroup.Text>
                <FormControl placeholder={"label"} type={'text'} onChange={this.handleSearch}
                             value={this.state.search}/>
                <InputGroup.Text>{filteredLabel.length}</InputGroup.Text>
            </InputGroup>
            <LabelsTable labels={filteredLabel} handlerManageRole={this.handleManageRole}
                         handlerDelete={this.handlerDelete}/>
                         
            
        </>)
    }
}

export default LabelRootPanel