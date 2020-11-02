import React, { Component } from 'react';
import { connect } from 'react-redux'

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { dateFilter, Comparator, customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';

import { emptyResultsTable, removeResult, addStudiesFiltered } from '../../../actions/TableResult'
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
        this.saveFilteredValues = this.saveFilteredValues.bind(this)
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
        dataField: 'Level',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'AnswerId',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'AnswerNumber',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'PatientName',
        text: 'Patient Name',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('PatientName')} onFilter={onFilter} saveValues={this.saveFilteredValues} ID='studyPatientName' />
        }
    }, {
        dataField: 'PatientID',
        text: 'Patient ID',
        sort: true,
        
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT, 
            
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('PatientID')} onFilter={onFilter} saveValues={this.saveFilteredValues} ID='studyPatientID'/>
        }
    }, {
        dataField: 'AccessionNumber',
        text: 'Accession Number',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('AccessionNumber')} onFilter={onFilter} saveValues={this.saveFilteredValues} ID='studyAccessionNumber'/>
        }
    }, {
        dataField: 'StudyDate',
        text: 'Acquisition Date',
        sort: true,
        filter: dateFilter()
    }, {
        dataField: 'StudyDescription',
        text: 'Study Description',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('StudyDescription')} onFilter={onFilter} saveValues={this.saveFilteredValues} ID='studyDate' />
        },
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    },{
        dataField: 'RequestedProcedureDescription',
        text: 'Requested Procedure Description',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('RequestedProcedureDescription')} onFilter={onFilter} saveValues={this.saveFilteredValues} ID='RequestedProcedureDescription' />
        },
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    }, {
        dataField: 'ModalitiesInStudy',
        text: 'Modalities',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('ModalitiesInStudy')} onFilter={onFilter} saveValues={this.saveFilteredValues} ID='studyModalities'/>
        }
    }, {
        dataField: 'OriginAET',
        text: 'AET',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('OriginAET')} onFilter={onFilter} saveValues={this.saveFilteredValues} ID='studyAET'/>
        }
    }, {
        dataField: 'StudyInstanceUID',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'NumberOfStudyRelatedSeries',
        text: 'Series'
    }, {
        dataField: 'NumberOfSeriesRelatedInstances',
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

    saveFilteredValues(){
        let resultDisplay = this.node.filterContext.data
        let filteredStudiesUID = resultDisplay.map(row => row.StudyInstanceUID)
        this.props.addStudiesFiltered(filteredStudiesUID)
    }

    render() {
        return (
            <ToolkitProvider
                keyField="StudyInstanceUID"
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
        results: state.AutoRetrieveResultList.results, 
        filters: state.AutoRetrieveResultList.filters
    }
}

const mapDispatchToProps = {
    emptyResultsTable,
    removeResult, 
    addStudiesFiltered
}

export default connect(mapStateToProps, mapDispatchToProps)(TableResultStudy);