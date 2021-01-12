import React, { Component } from 'react'
import Modal from "react-bootstrap/Modal";
import BootstrapTable from "react-bootstrap-table-next";

export default class ModalDetails extends Component {

    columnDetails = [
        {
            dataField: 'ID', 
            hidden: true
        }, {
            dataField: 'ErrorCode', 
            text: 'Error Code'
        }, 
        {
            dataField: 'ErrorDescription', 
            text: 'Error Description'
        }, {
            dataField: 'Priority', 
            text: 'Priority'
        }, {
            dataField: 'Type', 
            text: 'Type'
        }, {
            dataField: 'EffectiveRuntime', 
            text: 'Effective Runtime'
        }, {
            dataField: 'Content', 
            text: 'Details', 
            formatter: (cell, row, index) => {
                return (
                    <pre>
                        {JSON.stringify(row.Content , null, 2)}
                    </pre>
                )
            }
        }
    ]

    render = () => {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} size='xl'>
                    <Modal.Header closeButton>
                        <Modal.Title>Job Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <BootstrapTable 
                            keyField='ID' 
                            data={this.props.data} 
                            columns={this.columnDetails} 
                            striped={true} 
                            wrapperClasses="table-responsive" 
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' 
                        className='btn btn-primary' 
                        onClick={this.props.onHide}>
                            Close
                        </button>
                    </Modal.Footer>
                </Modal>
        );
    }
}