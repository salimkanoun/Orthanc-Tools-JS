import React, { Component } from 'react';
import { connect } from 'react-redux'

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import * as actions from '../../../actions/TableResult'


class TableResultSeries extends Component {

    async componentDidMount(){
        await this.fetchDataIfUnknown(this.props.rowData.studyInstanceUID, this.props.rowData.originAET)
    }

    async fetchDataIfUnknown(studyInstanceUID, originAET){
        
        var result = this.props.results.filter(study => {
            return study.studyInstanceUID === studyInstanceUID
        })

        if (result[0]['seriesDetails'].length === 0 ){
            await this.getSeriesDetails(studyInstanceUID, originAET)
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

        this.props.addSeriesDetails(queryAnswers, studyUID)

    }

    selectRow = {
        mode: 'checkbox',
        clickToSelect: true
    };

    columns = [{
        dataField: 'key',
        hidden: true
    },{
        dataField: 'level',
        hidden: true
    }, {
        dataField: 'answerId',
        hidden: true
    }, {
        dataField: 'answerNumber',
        hidden: true
    },{
        dataField: 'studyInstanceUID',
        hidden: true
    }, {
        dataField: 'serieInstanceUID',
        hidden: true
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
        dataField: 'numberOfSeriesRelatedInstances',
        text: 'Instances'
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



}



const mapStateToProps = (state) => {
    return {
        results: state.ResultList.results
    }
}

export default connect(mapStateToProps, actions)(TableResultSeries);