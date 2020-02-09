import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';

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
    },{
        dataField: 'level',
        text : 'level'
    }, {
        dataField: 'patientName',
        text : 'Patient Name'
    }, {
        dataField: 'patientId',
        text : 'Patient ID'
    }, {
        dataField : 'studyDate',
        text : 'Study Date'
    }, {
        dataField : 'modality',
        text : 'Modality'
    }, {
        dataField : 'studyDescription',
        text : 'Study Description'
    }, {
        dataField : 'accessionNb',
        text : 'Accession Nb'
    }, {
        dataField : 'aet',
        text : 'AET'
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

    render() {
        return (
                <div className="jumbotron">
                    <h1> Robot for User : {this.state.username} </h1>
                    <h1>Project Name : {this.state.projectName} </h1>
                    <BootstrapTable keyField="key" striped={true} data={this.state.rows} columns={this.columns} />
                </div>
        )
    }
}