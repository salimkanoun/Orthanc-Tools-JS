import React, { Component, Fragment } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import { toast } from 'react-toastify';

export default class Aets extends Component {

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
        formatter : this.deleteAetButton,
        formatExtraData : this
    }];

    echoAetButton(cell, row, rowIndex, formatExtraData) {
        return (<div className="text-center">
            <input type="button" className='btn btn-info' onClick = {() => formatExtraData.echoAetHandler(row.name)} value = "Echo" />
        </div>)
    }

    echoAetHandler(aetName){

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

    deleteAetButton(cell, row, rowIndex, formatExtraData) {
        console.log(formatExtraData)
        return (<div className="text-center">
            <input type="button" className='btn btn-danger' onClick = {() => formatExtraData.deleteAetHandler(row.name, formatExtraData.props.refreshAetData)} value = "Remove" />
            </div>)
    }

    deleteAetHandler(aetName, refreshHandler){
        fetch('/api/aets/'+aetName, {
            method : 'DELETE'
        })
        .then( res => res.json() )
        .then(() => {
            refreshHandler()
        })

    }

    render() {
        return (
            <Fragment>
                <BootstrapTable keyField="key" striped={true} data={this.props.rows} columns={this.columns} />
            </Fragment>
        )
    }
}