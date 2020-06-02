import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import filterFactory, { dateFilter, numberFilter, Comparator, customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { emptyResultsTable, addSeriesDetails, removeSeriesResult } from '../../../actions/TableResult'
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
        this.state = {reverFilter: false}
    }

    async componentDidMount(){
        //List studies for each series details are missing
        let emptyResultArray = []
        let studyUIDToQuery = Object.keys(this.props.results)
        let availableStudyUID = []
        for(let seriesUID of Object.keys(this.props.resultsSeries)){
            availableStudyUID.push(this.props.resultsSeries[seriesUID]['studyInstanceUID'])    
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
                await this.getSeriesDetails(studyResults.studyInstanceUID, studyResults.originAET)
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
            return <CustomFilter options={this.getOption('accessionNumber')} onFilter={onFilter} reverse={this.state.reverFilter} />
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
            return <CustomFilter options={this.getOption('studyDescription')} onFilter={onFilter} reverse={this.state.reverFilter} />
        }
    },{
        dataField: 'studyInstanceUID',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'seriesInstanceUID',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'seriesDescription',
        text: 'Serie Description',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('seriesDescription')} onFilter={onFilter} reverse={this.state.reverFilter} />
        }
    }, {
        dataField: 'modality',
        text: 'Modality',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('modality')} onFilter={onFilter} reverse={this.state.reverFilter} />
        }
    }, {
        dataField: 'seriesNumber',
        text: 'Serie Number',
        sort: true,
        filter: customFilter({
            comparator: Comparator.EQ,
            type: FILTER_TYPES.MULTISELECT
        }), 
        filterRenderer: (onFilter) => {
            return <CustomFilter options={this.getOption('seriesNumber')} onFilter={onFilter} reverse={this.state.reverFilter} />
        }
    }, {
        dataField: 'numberOfSeriesRelatedInstances',
        text: 'Instances',
        filter: numberFilter()
    }, {
        dataField: 'originAET',
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
                ...this.props.results[this.props.resultsSeries[seriesUID]['studyInstanceUID']],
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

    render() {
        let rows = this.buildResultsSeriesArray()
        return (
            <Fragment>
                <input type="button" className="btn btn-warning m-2" value="Delete Selected" onClick={this.removeRow} />
                <input type="button" className="btn btn-danger m-2" value="Empty Table" onClick={this.emptyTable} />
                <input type="button" className="btn btn-info m-2" value={this.state.reverFilter ? 'Normal Filter' : 'Reverse Filter'} onClick={() => this.setState({reverFilter: !this.state.reverFilter})} />
                <div className="mt-5">
                    <ToolkitProvider
                        keyField="seriesInstanceUID"
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
    removeSeriesResult
}

export default connect(mapStateToProps, mapDispatchToProps)(TableResultsStudiesSeries);