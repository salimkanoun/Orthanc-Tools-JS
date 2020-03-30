import React, { Component } from 'react';
import { connect } from 'react-redux'

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, dateFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import ExportButton from '../../Export/ExportButton';
import TableResultSeries from './TableResultSeries'

class TableResult extends Component {

    columns = [{
        dataField: 'key',
        hidden: true
    }, {
        dataField: 'answerId',
        hidden: true
    }, {
        dataField: 'answerNumber',
        hidden: true
    }, {
        dataField: 'patientName',
        text: 'Patient Name',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'patientID',
        text: 'Patient ID',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'accessionNumber',
        text: 'Accession Number',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'studyDate',
        text: 'Acquisition Date',
        sort: true,
        filter: dateFilter()
    }, {
        dataField: 'studyDescription',
        text: 'Study Description',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'modalitiesInStudy',
        text: 'Modalities',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'originAET',
        hidden: true
    }, {
        dataField: 'studyInstanceUID',
        hidden: true
    }, {
        dataField: 'numberOfStudyRelatedSeries',
        text: 'Series'
    }, {
        dataField: 'numberOfSeriesRelatedInstances',
        text: 'Instances'
    },{
        dataField: 'studyOrthancID',
        hidden : true
    }, {
        dataField : 'retrieve',
        text: 'Retrieve'
    }, {
        dataField : 'export',
        text : 'export',
        formatter : this.exportButton
    }];

    exportButton(cell, row, rowIndex) {
        return (<ExportButton exportType={ExportButton.HIRACHICAL} orthancIds={ [row.studyOrthancID] }/>)
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

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(TableResult);