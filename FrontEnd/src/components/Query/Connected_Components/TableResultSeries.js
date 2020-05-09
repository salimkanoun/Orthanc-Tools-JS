import React, { Component } from 'react';
import { connect } from 'react-redux'

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import { addManualQuerySeriesDetails } from '../../../actions/ManualQuery'

import apis from '../../../services/apis'
import RetrieveButton from '../Components/RetrieveButton';


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
        let seriesAnswers = await apis.query.retrieveAnswer(queryAnswers.ID)

        this.props.addManualQuerySeriesDetails(seriesAnswers, studyUID)

    }

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
    }, {
        dataField : 'retrieve',
        text: 'Retrieve',
        formatter : this.retrieveButton
    }];

    retrieveButton(cell, row, rowIndex){
        return (<RetrieveButton queryAet={row.originAET} uid={row.serieInstanceUID} level={RetrieveButton.Series} />)
    }

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
                            <BootstrapTable ref={n => this.node = n} {...props.baseProps} striped={true} bordered={ false } />
                        </React.Fragment>
                    )
                }
            </ToolkitProvider>
        )
    }



}



const mapStateToProps = (state) => {
    return {
        results: state.ManualQuery.manualQueryResults
    }
}

const mapDispatchToProps = {
    addManualQuerySeriesDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(TableResultSeries);