import React, { Component } from 'react';
import { connect } from 'react-redux'

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import filterFactory, { textFilter, dateFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { addSeriesDetails } from '../../../actions/TableResult'
import apis from '../../../services/apis';


/**
 * Generate Boostrap Table with Series related data
 * Will be nested in Result query Table
 */
class TableResultsStudiesSeries extends Component {

    constructor(props){
        super(props)
        this.buildResultsSeriesArray = this.buildResultsSeriesArray.bind(this)
    }

    async componentDidMount(){
        console.log(this.props)
        //Load All series details of studies answers
        for (let studyResults of this.props.results) {
            console.log(studyResults)
            if (studyResults['seriesDetails'].length === 0 ){
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
        dataField: 'key',
        hidden: true,
        csvExport: false
    },{
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
        dataField: 'serieInstanceUID',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'serieDescription',
        text: 'Serie Description',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'modality',
        text: 'Modality',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'serieNumber',
        text: 'Serie Number',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'numberOfSeriesRelatedInstances',
        text: 'Instances',
        filter: textFilter()
    }, {
        dataField: 'originAET',
        text: 'AET',
        sort: true
    }];

    buildResultsSeriesArray(){
        let seriesLines = []
        console.log(this.props.results)
        this.props.results.forEach(study => {
            study['seriesDetails'].forEach(seriesDetails => {
                seriesLines.push({
                ...study,
                ...seriesDetails
                })
            })
           
        });

        console.log(seriesLines)

        return seriesLines

    }

    selectRowSeries = {
        mode: 'checkbox',
        clickToSelect: true
    }

    render() {
        let rows = this.buildResultsSeriesArray()
        return (
            <ToolkitProvider
                keyField="key"
                data={rows}
                columns={this.columns}
            >{
                    props => (
                            <BootstrapTable ref={n => this.node = n} {...props.baseProps} selectRow = {this.selectRowSeries} striped={true} bordered={ false } filter={filterFactory()} pagination={paginationFactory()} />

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
    addSeriesDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(TableResultsStudiesSeries);