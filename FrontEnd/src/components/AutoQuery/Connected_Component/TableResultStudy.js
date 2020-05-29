import React, { Component } from 'react';
import { connect } from 'react-redux'

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, dateFilter, multiSelectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';

import { emptyResultsTable, removeResult } from '../../../actions/TableResult'


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
    options = {
        0: 'test', 
        2: 'azer', 
        1: 'Tep-Scan'
    }

    columns = [ {
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
        filter: multiSelectFilter({
            options: this.getOption('patientName')
        })
    }, {
        dataField: 'patientID',
        text: 'Patient ID',
        sort: true,
        filter: multiSelectFilter({
            options: this.getOption('patientID')
        })
    }, {
        dataField: 'accessionNumber',
        text: 'Accession Number',
        sort: true,
        filter: multiSelectFilter({
            options: this.getOption('accessionNumber')
        })
    }, {
        dataField: 'studyDate',
        text: 'Acquisition Date',
        sort: true,
        filter: dateFilter()
    }, {
        dataField: 'studyDescription',
        text: 'Study Description',
        sort: true,
        filter: multiSelectFilter({
            options: this.getOption('studyDescription')
        })
    }, {
        dataField: 'modalitiesInStudy',
        text: 'Modalities',
        sort: true,
        filter: multiSelectFilter({
            options: this.getOption('modalitiesInStudy')
        })
    }, {
        dataField: 'originAET',
        text: 'AET',
        sort: true,
        filter: multiSelectFilter({
            options: this.getOption('originAET')
        })
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

    

    selectRowStudies = {
        mode: 'checkbox',
        clickToSelect: true
    }

    getOption(cell){
        let desc = []
        let options = {}
        let rows = this.buildRowArray()
        rows.forEach(element => {
            if (!desc.includes(element[cell])){
                desc.push(element[cell])
            }
        })
        for (let i in desc){
            options = {
                ...options, 
                [desc[i]]: desc[i]
            }
        }
        return options
    }

    buildRowArray(){
        let rows = []
        for(const studyUID of Object.keys(this.props.results)){
            rows.push({
                ...this.props.results[studyUID]
            })
        }
        return rows
    }

    render() {
        return (
            <ToolkitProvider
                keyField="studyInstanceUID"
                data={this.buildRowArray()}
                columns={this.columns}
                exportCSV={{ onlyExportSelection: false, exportAll: true }}
            >{
                    props => (
                        <React.Fragment>
                            <div>
                                <ExportCSVButton {...props.csvProps} className="btn btn-primary m-2">Export CSV</ExportCSVButton>
                                <input type="button" className="btn btn-warning m-2" value="Delete Selected" onClick={this.removeRow} />
                                <input type="button" className="btn btn-danger m-2" value="Empty Table" onClick={this.emptyTable} />
                                <div className="mt-5">
                                    <BootstrapTable wrapperClasses="table-responsive" ref={n => this.node = n} {...props.baseProps} filter={filterFactory()} striped={true} selectRow={this.selectRowStudies} pagination={paginationFactory()} >
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
        results: state.AutoRetrieveResultList.results
    }
}

const mapDispatchToProps = {
    emptyResultsTable,
    removeResult
}

export default connect(mapStateToProps, mapDispatchToProps)(TableResultStudy);