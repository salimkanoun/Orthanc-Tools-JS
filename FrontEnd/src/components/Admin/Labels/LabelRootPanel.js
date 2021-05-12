import React, {Component} from "react";
import LabelsTable from "./LabelsTable";
import apis from "../../../services/apis";
import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import UserManagementModal from "./UserManagementModal";

class LabelRootPanel extends Component {

    state = {
        userManagement: null,
        labels: [],
        search: '',
        createLabel:''
    }

    componentDidMount() {
        apis.label.getAllLabels().then(labels => {
            this.setState({labels});
        })
    }

    handleManageUser = (label) => {
        this.setState({userManagement: label});
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

        return (<>
            <h2>Labels</h2>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text>Search</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl placeholder={"label"} type={'text'} onChange={this.handleSearch}
                             value={this.state.search}/>
                <InputGroup.Append>
                    <InputGroup.Text>{filteredLabel.length}</InputGroup.Text>
                </InputGroup.Append>
            </InputGroup>
            <LabelsTable labels={filteredLabel} handlerManageUser={this.handleManageUser}
                         handlerDelete={this.handlerDelete}/>
            <Form onSubmitCapture={this.handleCreateSubmit}>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>New</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl placeholder={"label"} type={'text'} onChange={this.handleCreateInput}
                                 value={this.state.createLabel}/>
                    <InputGroup.Append>
                        <Button variant={"outline-primary"} type={"submit"}> + </Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form>
            <UserManagementModal label={this.state.userManagement} handlerManageUser={this.handleManageUser}/>
        </>)
    }
}

export default LabelRootPanel