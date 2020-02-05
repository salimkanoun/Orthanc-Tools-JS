import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import { connect } from 'react-redux'
import * as actions from '../../../actions/TableResult'


class TableResultSeries extends Component {

    constructor(props) {
        super(props)
        console.log(props.rowData)
    }

    componentDidMount(){
        this.getSeriesDetails(this.props.rowData.studyInstanceUID, this.props.rowData.originAET)
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
        queryAnswers = [{
            studyInstanceUID : studyUID,
            serieInstanceUID : 'seriesUID',
            modality : 'modality',
            serieDescription : 'seriesDescription',
            serieNumber : 'seriesNumber',
            originAET : aet

        }]

        console.log(queryAnswers)
        console.log(this.props)
        this.props.addSeriesDetails(queryAnswers, studyUID)

    }

    selectRow = {
        mode: 'checkbox',
        clickToSelect: true
    };

    columns = [{
        dataField: 'number',
        hidden: true,
        csvExport: false
    }, {
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
    }];

    render() {
        console.log(this.props.results)
        console.log(this.props.rowData)

        let currentStudy = this.props.results.results.filter( (studyData)=>{
            if(studyData.studyInstanceUID === this.props.rowData.studyInstanceUID){
                return true
            }
            return false
        })

        console.log(currentStudy)
        let seriesDetails = currentStudy[0]['seriesDetails']
        console.log(seriesDetails)

        let seriesData = []
        seriesDetails.forEach( ( serie ) => {
            seriesData.push( {
                key : Math.random(),
                ...serie
            } )

        })

        console.log(seriesData)
        return (
            <ToolkitProvider
                keyField="key"
                data={seriesData}
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
        results: state.ResultList
    }
}

export default connect(mapStateToProps, actions)(TableResultSeries);