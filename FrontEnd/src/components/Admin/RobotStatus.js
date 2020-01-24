import React, { Component, Fragment } from 'react'
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
        dataField: 'schedule',
        text : 'Schedule Time'
    }, {
        dataField: 'queriesNb',
        text : 'Number of Queries'
    }];


    refreshHandler(){

        fetch("/robot", {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        }).then((answer)=>{
           return answer.json()})
           .then( (answerData) => {

                let state=this.state
                state.rows =  [{
                    key : Math.random(),
                    name : answerData.ProjectName,
                    queriesNb : answerData.QueriesNumber,
                    schedule : answerData.ScheduleTime
                }]

                this.setState({
                    ...this.state
                })

           })
    }

    render() {
        return (
                <Fragment>
                    <BootstrapTable keyField="key" striped={true} data={this.state.rows} columns={this.columns} />
                    <input type="button" className="btn btn-info" value="Refresh" onClick={this.refreshHandler} />
                </Fragment>
        )
    }
}