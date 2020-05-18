import React, { Component } from 'react';
import { connect } from 'react-redux'

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, dateFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';

import { emptyResultsTable, removeResult } from '../../../actions/TableResult'

import CreateRobot from '../Component/CreateRobot'
import TableResultSeries from './TableResultSeries'

const { ExportCSVButton } = CSVExport;
/**
 * Result Table of Query for Study Level
 */
class TableResultStudy extends Component {

    constructor(props) {
        super(props)
        this.removeRow = this.removeRow.bind(this)
        this.emptyTable = this.emptyTable.bind(this)
    }

    removeRow() {
        let selectedKeyRow = this.node.selectionContext.selected
        this.props.removeResult(selectedKeyRow)
        this.node.selectionContext.selected = []
    }

    emptyTable() {
        this.props.emptyResultsTable()
    }

    columns = [{
        dataField: 'number',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'level',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'answerId',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'answerNumber',
        hidden: true,
        csvExport: false
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
        text: 'AET',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'studyInstanceUID',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'numberOfStudyRelatedSeries',
        text: 'Series'
    }, {
        dataField: 'numberOfSeriesRelatedInstances',
        text: 'Instances'
    }]; 
    
    selectRowSeries = {
        mode: 'checkbox',
        hideSelectAll : true,
        clickToSelect: true
    }

    selectRowStudies = {
        mode: 'checkbox',
        hideSelectAll : true,
        clickToSelect: true
    }

    expandRow = {
        showExpandColumn: true,
        renderer: (row) => {
            return (
                <TableResultSeries rowData={row} selectRow={this.selectRowSeries} ></TableResultSeries>
            )
        }
    }

    render() {
        return (
            <ToolkitProvider
                keyField="key"
                data={this.props.results}
                columns={this.columns}
                exportCSV={{ onlyExportSelection: false, exportAll: true }}
            >{
                    props => (
                        <React.Fragment>
                            <div className="jumbotron" style={this.props.style}>
                                <div>
                                    <ExportCSVButton {...props.csvProps} className="btn btn-primary m-2">Export CSV</ExportCSVButton>
                                    <input type="button" className="btn btn-danger m-2" value="Delete Selected" onClick={this.removeRow} />
                                    <input type="button" className="btn btn-danger m-2" value="Empty Table" onClick={this.emptyTable} />
                                    <div className="mt-5">
                                        <BootstrapTable wrapperClasses="table-responsive" ref={n => this.node = n} {...props.baseProps} filter={filterFactory()} striped={true} selectRow={this.selectRowStudies} pagination={paginationFactory()} expandRow={this.expandRow} >
                                        </BootstrapTable>
                                    </div>
                                </div>
                                <CreateRobot resultArray={this.props.results} switchTab = {this.props.switchTab} ></CreateRobot>
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
        results: state.ResultList.results
    }
}

const mapDispatchToProps = {
    emptyResultsTable,
    removeResult
}

export default connect(mapStateToProps, mapDispatchToProps)(TableResultStudy);