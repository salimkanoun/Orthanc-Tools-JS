import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import { connect } from 'react-redux'
import * as actions from '../../../actions/TableResult'

import RetrieveButton from './RetrieveButton'
import ExportButton from './ExportButton'


class TableResultSeries extends Component {

    constructor(props) {
        super(props)
        console.log(props.rowData)
    }

    componentDidMount(){
        this.fetchDataIfUnknown(this.props.rowData.studyInstanceUID, this.props.rowData.originAET)
    }

    fetchDataIfUnknown(studyInstanceUID, originAET){
        
        var result = this.props.results.filter(study => {
            return study.studyInstanceUID === studyInstanceUID
        })

        if (result[0]['seriesDetails'].length === 0 ){
            this.getSeriesDetails(studyInstanceUID, originAET)
        } 
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
        //SK SIMULATION REPONSE
        /*
        queryAnswers = [{
            studyInstanceUID : studyUID,
            serieInstanceUID : 'seriesUID',
            modality : 'modality',
            serieDescription : 'seriesDescription',
            serieNumber : 'seriesNumber',
            originAET : aet

        }]
        */
        console.log(queryAnswers)
        console.log(this.props)
        this.props.addSeriesDetails(queryAnswers, studyUID)

    }

    selectRow = {
        mode: 'checkbox',
        clickToSelect: true
    };

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
        sort: true
    }, {
        dataField: 'modality',
        text: 'Modality',
        sort: true
    }, {
        dataField: 'serieNumber',
        text: 'Serie Number',
        sort: true
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

    render() {

        let currentStudy = this.props.results.filter( (studyData)=>{
            if(studyData.studyInstanceUID === this.props.rowData.studyInstanceUID){
                return true
            }
            return false
        })

        let seriesDetails = currentStudy[0]['seriesDetails']

        return (
            <ToolkitProvider
                keyField="key"
                data={seriesDetails}
                columns={this.columns}
            >{
                    props => (
                        <React.Fragment>
                            <BootstrapTable ref={n => this.node = n} {...props.baseProps} striped={true} selectRow={this.selectRow} bordered={ false } />
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
        results: state.ResultList.results
    }
}

export default connect(mapStateToProps, actions)(TableResultSeries);