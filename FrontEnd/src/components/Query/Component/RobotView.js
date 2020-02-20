import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter, dateFilter, selectFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator';

export default class RobotView extends Component {

    constructor(props){
        super(props)
        this.refreshHandler=this.refreshHandler.bind(this)
        this.state = {
            rows : [],
            username : this.props.match.params.username
        }
    }

    componentDidMount(){
        this.refreshHandler();
    }

    columns = [{
        dataField: 'key',
        hidden: true
    }, {
        dataField: 'level',
        text : 'level',
        filter: selectFilter({
            options: { study : 'study', series : 'series'}
        })
    }, {
        dataField: 'patientName',
        text : 'Patient Name',
        filter: textFilter()
    }, {
        dataField: 'patientId',
        text : 'Patient ID',
        filter: textFilter()
    }, {
        dataField : 'studyDate',
        text : 'Study Date',
        filter: dateFilter()
    }, {
        dataField : 'modality',
        text : 'Modality',
        filter: textFilter()
    }, {
        dataField : 'studyDescription',
        text : 'Study Description',
        filter: textFilter()
    }, {
        dataField : 'accessionNb',
        text : 'Accession Nb',
        filter: textFilter()
    }, {
        dataField : 'aet',
        text : 'AET',
        filter: textFilter()
    }, {
        dataField : 'status',
        text : 'Status',
        filter: textFilter()
    }, {
        dataField : 'remove',
        text : 'Remove Query',
        formatter : this.removeQueryButton,
        formatExtraData : this
    }];


    refreshHandler(){

        fetch("/api/robot/"+this.state.username, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        }).then((answer)=>{
           return answer.json()})
           .then( (answerData) => {

                let state=this.state
                state.projectName= answerData.projectName
                state.rows = []

                answerData.retrieveList.forEach(robotJob => {
                    state.rows.push({
                        key : Math.random(),
                        ...robotJob
                    })
                    
                });

                this.setState({
                    ...this.state
                })

           })
    }

    async deleteQueryHandler(rowIndex, refreshHandler){

        await fetch("/api/robot/"+this.state.username+"/"+rowIndex, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((answer)=>{
            return answer.json()
        })

        refreshHandler()

    }

    removeQueryButton(cell, row, rowIndex, formatExtraData) {
        return (<div className="text-center">
            <input type="button" className='btn btn-danger' onClick = {() => formatExtraData.deleteQueryHandler(rowIndex, formatExtraData.refreshHandler)} value = "Remove" />
            </div>)
    }

    render() {
        return (
                <div className="jumbotron">
                    <h1> Robot for user {this.state.username}, project : {this.state.projectName} </h1>
                    <BootstrapTable keyField="key" striped={true} filter={filterFactory()} pagination={paginationFactory()} data={this.state.rows} columns={this.columns} />
                </div>
        )
    }
}