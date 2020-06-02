import React, { Component } from 'react';
import { connect } from 'react-redux'

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { dateFilter, Comparator, customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';

import { emptyResultsTable, removeResult } from '../../../actions/TableResult'
import CustomFilter from './CustomFilter';


const { ExportCSVButton } = CSVExport;
/**
 * Result Table of Query for Study Level
 */

class TableResultStudy extends Component {

    constructor(props) {
        super(props)
        this.removeRow = this.removeRow.bind(this)
        this.emptyTable = this.emptyTable.bind(this)
        this.state = {reverFilter: false}
    }


    removeRow() {
        let selectedKeyRow = this.node.selectionContext.selected
        this.props.removeResult(selectedKeyRow)
        this.node.selectionContext.selected = []
    }

    emptyTable() {
        this.props.emptyResultsTable()
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
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('patientName')} onFilter={onFilter} reverse={this.state.reverFilter}/>
        }
    }, {
        dataField: 'patientID',
        text: 'Patient ID',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('patientID')} onFilter={onFilter} reverse={this.state.reverFilter}/>
        }
    }, {
        dataField: 'accessionNumber',
        text: 'Accession Number',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('accessionNumber')} onFilter={onFilter} reverse={this.state.reverFilter}/>
        }
    }, {
        dataField: 'studyDate',
        text: 'Acquisition Date',
        sort: true,
        filter: dateFilter()
    }, {
        dataField: 'studyDescription',
        text: 'Study Description',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('studyDescription')} onFilter={onFilter} reverse={this.state.reverFilter}/>
        }
    }, {
        dataField: 'modalitiesInStudy',
        text: 'Modalities',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('modalitiesInStudy')} onFilter={onFilter} reverse={this.state.reverFilter}/>
        }
    }, {
        dataField: 'originAET',
        text: 'AET',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('originAET')} onFilter={onFilter} reverse={this.state.reverFilter}/>
        }
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
        let options = []
        let rows = this.buildRowArray()
        rows.forEach(element => {
            let find = false
            options.forEach(option => {if (option.value === element[cell]) find = true})
            if (!find){
                options.push({value: element[cell], label: element[cell]})
            }
        })
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

    getFilteredRessources(){
        return this.node.filterContext.data
    }

    getSelectedUID(){
        return this.node.selectionContext.selected
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
                                <input type="button" className="btn btn-info m-2" value={this.state.reverFilter ? 'Normal Filter' : 'Reverse Filter'} onClick={() => this.setState({reverFilter: !this.state.reverFilter})} />
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