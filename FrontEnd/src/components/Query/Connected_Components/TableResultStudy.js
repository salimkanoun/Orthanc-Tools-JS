import React, { Component } from 'react';
import { connect } from 'react-redux'

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, dateFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import TableResultSeries from './TableResultSeries'
import RetrieveButton from '../Components/RetrieveButton';

class TableResult extends Component {

    columns = [{
        dataField: 'key',
        hidden: true
    }, {
        dataField: 'AnswerId',
        hidden: true
    }, {
        dataField: 'AnswerNumber',
        hidden: true
    }, {
        dataField: 'PatientName',
        text: 'Patient Name',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'PatientID',
        text: 'Patient ID',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'AccessionNumber',
        text: 'Accession Number',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'StudyDate',
        text: 'Acquisition Date',
        sort: true,
        filter: dateFilter()
    }, {
        dataField: 'StudyDescription',
        text: 'Study Description',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'ModalitiesInStudy',
        text: 'Modalities',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'OriginAET',
        hidden: true
    }, {
        dataField: 'StudyInstanceUID',
        hidden: true
    }, {
        dataField: 'NumberOfStudyRelatedSeries',
        text: 'Series'
    }, {
        dataField: 'NumberOfSeriesRelatedInstances',
        text: 'Instances'
    },{
        dataField: 'StudyOrthancID',
        hidden : true
    }, {
        dataField : 'Retrieve',
        text: 'Retrieve',
        formatter : this.retrieveButton
    }];

    retrieveButton(cell, row, rowIndex){
        return (<RetrieveButton queryAet={row.OriginAET} uid={row.StudyInstanceUID} level={RetrieveButton.Study} />)
    }

    expandRow = {
        showExpandColumn: true,
        renderer : (row) => {
            return(
                <TableResultSeries rowData={row}></TableResultSeries>
            )
        }
    }

    render() {
        return (
            <ToolkitProvider
                keyField="key"
                data={this.props.results}
                columns={this.columns}
            >{
                props => (
                    <React.Fragment>
                        <div className="jumbotron" style={this.props.style}>
                            <div className="mt-5">
                                <BootstrapTable wrapperClasses="table-responsive" ref={n => this.node = n} {...props.baseProps} filter={filterFactory()} striped={true} selectRow={this.selectRow} pagination={paginationFactory()} expandRow={ this.expandRow } >
                                </BootstrapTable>
                            </div>
                        </div>
                    </React.Fragment>
                )
            }
            </ToolkitProvider>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        results: state.ManualQuery.manualQueryResults
    }
}

export default connect(mapStateToProps, null)(TableResult);