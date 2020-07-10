import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal'

import BootstrapTable from 'react-bootstrap-table-next'


export default class AnonymizeRobotDetails extends Component{

    columns = [
        {
            dataField: 'sourceOrthancStudyID', 
            hidden: true
        },  {
            dataField: 'originalPatientName',
            text: 'Original Patient Name'
        }, {
            dataField: 'originalPatientID', 
            text: 'Original Patient ID'
        }, {
            dataField: 'originalStudyDescription', 
            text: 'Original Study Description'
        }, {
            dataField: 'originalAccessionNumber', 
            text: 'Original Accession Number'
        }, {
            dataField: 'newPatientName',
            text: 'New Patient Name'
        }, {
            dataField: 'newPatientID', 
            text: 'New Patient ID'
        }, {
            dataField: 'newStudyDescription', 
            text: 'New Study Description'
        }, {
            dataField: 'newAccessionNumber', 
            text: 'New Accession Number'
        }, {
            dataField : 'Status',
            text : 'Status'
        }
    ]

    render(){
        return (
            <Fragment>
                <Modal show={this.props.show} scrollable={true} onHide={this.props.onHide}  size="lg" >
                <Modal.Header closeButton >
                    <Modal.Title>Progress</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BootstrapTable
                            keyField="sourceOrthancStudyID" 
                            striped={true} 
                            columns={this.columns}
                            data={this.props.robotItems}
                            wrapperClasses="table-responsive"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button type='button' className='btn btn-primary text-center' onClick={this.props.onHide}>Close</button>
                </Modal.Footer>
                </Modal>
        </Fragment>
        )
    }

}