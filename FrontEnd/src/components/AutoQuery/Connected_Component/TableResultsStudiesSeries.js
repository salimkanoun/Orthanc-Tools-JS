import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import filterFactory, { textFilter, dateFilter, numberFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { addSeriesDetails, removeSeriesResult } from '../../../actions/TableResult'
import apis from '../../../services/apis';

/**
 * Show Series details of studies results
 */
class TableResultsStudiesSeries extends Component {

    constructor(props){
        super(props)
        this.buildResultsSeriesArray = this.buildResultsSeriesArray.bind(this)
        this.removeRow = this.removeRow.bind(this)
    }

    async componentDidMount(){
        //List studies for each series details are missing
        let emptyResultArray = []

        //SK A REVOIR
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
            let i = 1
            //Load All series details of studies answers
            for (let studyResults of emptyResultArray) {
                toast.update(id, {
                    render : 'Fetching series for '+(i++)+'/'+(emptyResultArray.length)
                });
                await this.getSeriesDetails(studyResults.studyInstanceUID, studyResults.originAET)
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
        filter: textFilter()
    }, {
        dataField: 'modality',
        text: 'Modality',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'seriesNumber',
        text: 'Serie Number',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'numberOfSeriesRelatedInstances',
        text: 'Instances',
        filter: numberFilter()
    }, {
        dataField: 'originAET',
        text: 'AET',
        sort: true
    }];

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

    render() {
        let rows = this.buildResultsSeriesArray()
        return (
            <Fragment>
                <input type="button" className="btn btn-danger m-2" value="Delete Selected" onClick={this.removeRow} />
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
    addSeriesDetails,
    removeSeriesResult
}

export default connect(mapStateToProps, mapDispatchToProps)(TableResultsStudiesSeries);