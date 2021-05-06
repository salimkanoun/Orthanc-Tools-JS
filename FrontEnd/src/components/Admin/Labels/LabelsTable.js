import React, {Component} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {Button} from "react-bootstrap";


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
                                                     onClick={() => this.props.handlerManageUser(row.label_name)}>Manage
                Users</Button>
        },
        {
            dataField: '_d',
            text: 'Delete',
            formatter: (cell, row, index) => <Button variant={"danger"}
                                                     onClick={() => this.props.handlerDelete(row.label_name)}>Delete
                Label</Button>
        }
    ]

    render() {
        return (
            <BootstrapTable keyField={'label_name'} columns={this.columns} data={this.props.labels}/>
        );
    }
}