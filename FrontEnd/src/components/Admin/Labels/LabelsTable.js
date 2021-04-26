import React, {Component} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {Button} from "react-bootstrap";
import apis from "../../../services/apis";


export default class LabelsTable extends Component {
    columns = [
        {
            dataField: 'label_name',
            text: 'Label',
            hidden: false
        },
        {
            dataField: '_u',
            text: 'Users',
            formatter: (cell, row, index) => <Button variant={"primary"}
                                                     onClick={this.handleManageUser(row.label_name)}>Manage
                Users</Button>
        },
        {
            dataField: '_d',
            text: 'Delete',
            formatter: (cell, row, index) => <Button variant={"danger"} onClick={this.handlerDelete(row.label_name)}>Delete
                Task</Button>
        }
    ]

    state = {
        userManagement: null,
        labels: []
    }

    componentDidMount() {
        apis.label.getAllLabels().then(labels => {
            this.setState({labels});
        })
    }

    handleManageUser(label) {
        return () => {
            this.setState({userManagement: label});
        };
    }

    handlerDelete(label) {
        return () => apis.label.deleteLabels(label).then(() => {
            let labels = this.state.labels.filter(l => l !== label.label_name);
            this.setState({labels});
        });
    }

    render() {
        return (
            <BootstrapTable keyField={'label_name'} columns={this.columns} data={this.state.labels}/>
        );
    }
}