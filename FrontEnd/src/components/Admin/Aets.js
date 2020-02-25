import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import { toast } from 'react-toastify';

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
        dataField: 'aetName',
        text : 'Aet Name'
    }, {
        dataField: 'ip',
        text : 'IP Adress'
    }, {
        dataField: 'port',
        text : 'Port'
    },{
        dataField : 'manufacturer',
        text : 'Manufacturer'
    }, {
        dataField : 'echo',
        text : 'Echo Aet',
        formatter : this.echoAetButton,
        formatExtraData : this
    }, {
        dataField : 'remove',
        text : 'Remove Aet',
        formatter : this.removeAetButton,
        formatExtraData : this
    }];

    echoAetButton(cell, row, rowIndex, formatExtraData) {
        return (<div className="text-center">
            <input type="button" className='btn btn-info' onClick = {() => formatExtraData.echoAetHandler(row.name, formatExtraData.refreshHandler)} value = "Echo" />
        </div>)
    }

    echoAetHandler(aetName, refreshHandler){

        fetch('/api/aets/' + aetName + '/echo', {
            method : 'GET'
        }).then( res => res.json() ).then((answer) => {
            if(answer){
                toast.success('Echo ' + aetName +' Sucess', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }else{
                toast.error('Echo ' + aetName +' Error', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }

        })

    }

    removeAetButton(cell, row, rowIndex, formatExtraData) {
        return (<div className="text-center">
            <input type="button" className='btn btn-danger' onClick = {() => formatExtraData.deleteAetHandler(row.name, formatExtraData.refreshHandler)} value = "Remove" />
            </div>)
    }

    deleteAetHandler(aetName, refreshHandler){
        fetch('/api/aets/'+aetName, {
            method : 'DELETE'
        }).then( res => res.json() ).then(() => {
            refreshHandler()
        })

    }

    refreshHandler(){

        fetch("/api/aets", {
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

                answerData.forEach(aet => {
                    state.rows.push({
                        key : Math.random(),
                        name : aet.name,
                        aetName : aet.aetName,
                        ip : aet.ip,
                        port : aet.port,
                        manufacturer : aet.manufacturer
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