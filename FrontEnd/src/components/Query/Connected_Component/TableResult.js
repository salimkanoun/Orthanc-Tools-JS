import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, { textFilter, dateFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';

import { connect } from 'react-redux'
import * as actions from '../../../actions/TableResult'

import RetrieveButton from './RetrieveButton'
import ExportButton from './ExportButton'
import CreateRobot from './../Component/CreateRobot'

import TableResultSeries from './TableResultSeries'


class TableResult extends Component {

    constructor(props) {
        super(props)
        this.removeRow = this.removeRow.bind(this)
        this.emptyTable=this.emptyTable.bind(this)
        //this.onSelectAll=this.onSelectAll.bind(this)
    }

    removeRow() {
        let selectedKeyRow = this.node.selectionContext.selected
        this.props.removeResult(selectedKeyRow)
        this.node.selectionContext.selected = []
    }

    emptyTable () {
        this.props.emptyResultsTable()
    }

    async getSeriesDetails(studyUID, aet){

        let post = {
            level : 'Serie',
            studyUID: studyUID,
            aet : aet
        }

        let queryAnswers = await fetch("/api/query",
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(post)
        }).then((answer)=>{
          return(answer.json())
        })

        console.log(queryAnswers)
        return queryAnswers

    }

    /*
    onSelectAll = (isSelected) => {
        if (isSelected) {            
           return this.node.table.props.data.map(row => row.key);
         } else {
           return [];
         }
      }
      */

    selectRow = {
        mode: 'checkbox',
        clickToSelect: true
        //,onSelectAll: this.onSelectAll
    };

    columns = [{
        dataField: 'number',
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
        dataField: 'retrive',
        text: 'Retrieve',
        formatter: this.retrieveButton,
        csvExport: false
    }, {
        dataField: 'jobId',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'export',
        text: 'Export',
        formatter: this.exportButton,
        csvExport: false
    }];

      
      
    expandRow = {
        
        showExpandColumn: true,
        renderer : (row) => {
            return(
                <TableResultSeries rowData={row}></TableResultSeries>
            )
        }
        
    }



    render() {

        const { ExportCSVButton } = CSVExport;
        return (
            <ToolkitProvider
                keyField="key"
                data={this.props.results.results}
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
                                        <BootstrapTable ref={n => this.node = n} {...props.baseProps} filter={filterFactory()} striped={true} selectRow={this.selectRow} pagination={paginationFactory()} expandRow={ this.expandRow } >
                                        </BootstrapTable>
                                    </div>
                                </div>
                                <CreateRobot resultArray={this.props.results.results}></CreateRobot>
                            </div>
                        </React.Fragment>
                    )
                }
            </ToolkitProvider>
        )
    }

    retrieveButton(cell, row, rowIndex, formatExtraData) {
        //Add Retrieve button for each result with row data in props
        return <RetrieveButton rowData={row} />

    }

    exportButton(cell, row, rowIndex, formatExtraData) {
        return <ExportButton rowData={row} />
    }

}



const mapStateToProps = (state) => {
    return {
        results: state.ResultList
    }
}

export default connect(mapStateToProps, actions)(TableResult);