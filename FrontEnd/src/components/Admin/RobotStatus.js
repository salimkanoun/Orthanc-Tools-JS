import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';

export default class RobotStatus extends Component {

    constructor(props){
        super(props)
        this.refreshHandler=this.refreshHandler.bind(this)
        this.state = {
            rows : []
        }
    }

    componentDidMount(){
        this.refreshHandler();
    }

    columns = [{
        dataField: 'key',
        hidden: true
    },{
        dataField: 'name',
        text : 'Name'
    }, {
        dataField: 'username',
        text : 'Username'
    }, {
        dataField: 'queriesNb',
        text : 'Number of Queries'
    }];


    refreshHandler(){

        fetch("/api/robot", {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        }).then((answer)=>{
           return answer.json()})
           .then( (answerData) => {

                let state=this.state

                state.rows = []

                answerData.forEach(robotJob => {
                    state.rows.push({
                        key : Math.random(),
                        name : robotJob.projectName,
                        username : robotJob.username,
                        queriesNb : robotJob.retrieveList.length
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
                    <BootstrapTable keyField="key" striped={true} data={this.state.rows} columns={this.columns} />
                    <input type="button" className="btn btn-info" value="Refresh" onClick={this.refreshHandler} />
                </div>
        )
    }
}