import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import filterFactory, { dateFilter, numberFilter, Comparator, customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { emptyResultsTable, addSeriesDetails, removeSeriesResult, addSeriesFiltered } from '../../../actions/TableResult'
import apis from '../../../services/apis';
import CustomFilter from './CustomFilter';

/**
 * Show Series details of studies results
 */
class TableResultsStudiesSeries extends Component {

    constructor(props){
        super(props)
        this.buildResultsSeriesArray = this.buildResultsSeriesArray.bind(this)
        this.emptyTable = this.emptyTable.bind(this)
        this.removeRow = this.removeRow.bind(this)
        this.saveFilteredValues = this.saveFilteredValues.bind(this)
    }

    async componentDidMount(){
        //List studies for each series details are missing
        let emptyResultArray = []
        let studyUIDToQuery = Object.keys(this.props.results)
        let availableStudyUID = []
        for(let seriesUID of Object.keys(this.props.resultsSeries)){
            availableStudyUID.push(this.props.resultsSeries[seriesUID]['StudyInstanceUID'])    
        } 

        studyUIDToQuery.forEach (studyUID =>{
            if( ! availableStudyUID.includes(studyUID)) emptyResultArray.push(this.props.results[studyUID])
        })
        

        if(emptyResultArray.length>0){
            const id = toast.info('Starting Series Fetching');
            let i = 0
            //Load All series details of studies answers
            for (let studyResults of emptyResultArray) {
                i++
                await this.getSeriesDetails(studyResults.StudyInstanceUID, studyResults.OriginAET)
                toast.update(id, {
                    render : 'Queried series '+i+'/'+(emptyResultArray.length)
                });
            }
        }


    }

    async getSeriesDetails(studyUID, aet){

        let queryData = {
            Level: 'Series',
            Query: {
                Modality: '',
                ProtocolName: '',
                SeriesDescription: '',
                SeriesInstanceUID: '',
                StudyInstanceUID: studyUID,
                SeriesNumber: '',
                NumberOfSeriesRelatedInstances: ''
            },
            Normalize: false
        }

        let queryAnswers = await apis.query.dicomQuery(aet,queryData);
        let seriesAnswers = await apis.query.retrieveAnswer(queryAnswers['ID'])

        this.props.addSeriesDetails(seriesAnswers, studyUID)

    }

    emptyTable() {
        this.props.emptyResultsTable()
    }

    columns = [{
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
            return <CustomFilter options={this.getOption('PatientName')} onFilter={onFilter} saveValues={this.saveFilteredValues} ID='seriesPatientName'/>
        }
    }, {
        dataField: 'PatientID',
        text: 'Patient ID',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('PatientID')} onFilter={onFilter} saveValues={this.saveFilteredValues} ID='seriesPatientID'/>
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
            return <CustomFilter options={this.getOption('AccessionNumber')} onFilter={onFilter} saveValues={this.saveFilteredValues} ID='seriesAccessionNumber'/>
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
            return <CustomFilter options={this.getOption('StudyDescription')} onFilter={onFilter} saveValues={this.saveFilteredValues} ID='seriesStudyDesc'/>
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
    },{
        dataField: 'StudyInstanceUID',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'SeriesInstanceUID',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'SeriesDescription',
        text: 'Serie Description',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('SeriesDescription')} onFilter={onFilter} saveValues={this.saveFilteredValues} ID='seriesDesc'/>
        },
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    }, {
        dataField: 'Modality',
        text: 'Modality',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('Modality')} onFilter={onFilter} saveValues={this.saveFilteredValues} ID='seriesModalities'/>
        }
    }, {
        dataField: 'SeriesNumber',
        text: 'Serie Number',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('SeriesNumber')} onFilter={onFilter} saveValues={this.saveFilteredValues} ID='seriesNumber'/>
        }
    }, {
        dataField: 'NumberOfSeriesRelatedInstances',
        text: 'Instances',
        filter: numberFilter()
    }, {
        dataField: 'OriginAET',
        text: 'AET',
        sort: true
    }];

    getOption(cell){
        let options = []
        let rows = this.buildResultsSeriesArray()
        rows.forEach(element => {
            let find = false
            options.forEach(option => {if (option.value === element[cell]) find = true})
            if (!find){
                options.push({value: element[cell], label: element[cell]})
            }
        })
        return options 
    }

    buildResultsSeriesArray(){
        let seriesLines = []
        for(let seriesUID of Object.keys(this.props.resultsSeries)){
            seriesLines.push({
                ...this.props.results[this.props.resultsSeries[seriesUID]['StudyInstanceUID']],
                ...this.props.resultsSeries[seriesUID],

            })
        }
        return seriesLines
    }

    selectRowSeries = {
        mode: 'checkbox',
        clickToSelect: true
    }

    removeRow() {
        let selectedKeyRow = this.node.selectionContext.selected
        console.log(selectedKeyRow)
        this.props.removeSeriesResult(selectedKeyRow)
        this.node.selectionContext.selected = []
    }

    getFilteredRessources(){
        return this.node.filterContext.data
    }

    getSelectedUID(){
        return this.node.selectionContext.selected
    }

    saveFilteredValues(){
        let resultDisplay = this.node.filterContext.data
        let filteredSeriesUID = resultDisplay.map(row => row.SeriesInstanceUID)
        this.props.addSeriesFiltered(filteredSeriesUID)
    }

    render() {
        let rows = this.buildResultsSeriesArray()
        return (
            <Fragment>
                <input type="button" className="btn btn-warning m-2" value="Delete Selected" onClick={this.removeRow} />
                <input type="button" className="btn btn-danger m-2" value="Empty Table" onClick={this.emptyTable} />
                <div className="mt-5">
                    <ToolkitProvider
                        keyField="SeriesInstanceUID"
                        data={rows}
                        columns={this.columns}
                    >{
                        props => (
                            <BootstrapTable ref={n => this.node = n} {...props.baseProps} wrapperClasses="table-responsive" selectRow = {this.selectRowSeries} striped={true} bordered={ false } filter={filterFactory()} pagination={paginationFactory()} />

                        )
                    }
                    </ToolkitProvider>
                </div>
            </Fragment>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        results : state.AutoRetrieveResultList.results,
        resultsSeries: state.AutoRetrieveResultList.resultsSeries
    }
}

const mapDispatchToProps = {
    emptyResultsTable,
    addSeriesDetails,
    removeSeriesResult, 
    addSeriesFiltered
}

export default connect(mapStateToProps, mapDispatchToProps)(TableResultsStudiesSeries);