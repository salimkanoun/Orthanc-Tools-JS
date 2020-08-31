
import React, { Component } from 'react'

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator'

import Toggle from 'react-toggle'

import apis from '../../services/apis'

import audioSuccess from '../../sounds/cd_Error.wav';
import audioFailure from '../../sounds/cd_Success.wav';

export default class CDBurner extends Component {

    constructor(props){
        super(props)
        this.toogleHandler = this.toogleHandler.bind(this)
        this.refreshTableData = this.refreshTableData.bind(this)
        this.audioSuccess = new Audio('/sounds/cd_Error.wav')
        this.audioFailure = new Audio('/sounds/cd_Success.wav')
    }

    state = {
        robotStarted : false,
        burnerJobs : [],
        firstRefresh : false
    }

    audioSuccess = new Audio('/sounds/cd_Error.wav')
    audioFailure = new Audio('/sounds/cd_Success.wav')

    async refreshTableData(){

        let cdBurnerData = await apis.cdBurner.getCdBuner()
        let jobs = cdBurnerData.Jobs

        let newTablearray = []

        Object.keys(jobs).forEach(jobKey =>{
            console.log(jobKey)
            console.log(jobs[jobKey])
            newTablearray.push({
                cdJobID : jobKey,
                status : jobs[jobKey]['status'],
                ...jobs[jobKey]['details']
            })
        })

        this.setState({
            firstRefresh : true,
            robotStarted : cdBurnerData.CdBurnerService,
            burnerJobs : newTablearray 
        })

    }

    async toogleHandler(event){
       
        let startStatus = this.state.robotStarted

        try{
            let newStatus
            if(!startStatus){
                await apis.cdBurner.startCdBurnerService()
                newStatus = true
            }else{
                await apis.cdBurner.stopCdBurnerService()
                newStatus = false
            }

            this.setState({
                robotStarted : newStatus
            })
        }catch (err){
            console.log(err)
        }

    }

   async componentDidMount(){
    await this.audioFailure.play()
        console.log(this.audioFailure)
       
        this.updateInterval = setInterval(this.refreshTableData, 2000)


    }

    componentWillUnmount(){
        clearInterval(this.updateInterval)
    }


    columns = [
        {
            dataField: 'cdJobID', 
            hidden: true
        },
        {
            dataField : 'patientName',
            text : 'Patient Name'
        },
        {
            dataField : 'patientID',
            text : 'Patient ID'
        },
        {
            dataField : 'patientDOB',
            text : 'Patient Birth Date'
        },
        {
            dataField : 'studyDate',
            text : 'Study Date'
        },
        {
            dataField : 'studyDescription',
            text : 'Study Description'
        },
        {
            dataField : 'status',
            text : 'CD Status'
        },
        {
            dataField : 'cancelButton',
            text : 'Cancel',
            formatter : this.cancelCDButton
        }
    ]

    cancelCDButton(){
        return (
            <div className="text-center">
                <input type="button" className='btn btn-danger' onClick = {() => console.log('click')} value = "Cancel" />
            </div>
        )
    }

    render(){

        return (
            
            <div className='jumbotron'>
                <div className = "row container text-center mb-3">
                    <div className = "col align-middle">
                        <h2>CD Burner Service</h2>
                    </div>
                    <div className = "col">
                        <Toggle checked={this.state.robotStarted} onChange={this.toogleHandler} disabled = {!this.state.firstRefresh}/> 
                    </div>
                </div>
                 <BootstrapTable 
                        keyField='cdJobID' 
                        data={this.state.burnerJobs} 
                        columns={this.columns} 
                        striped 
                        pagination={paginationFactory()} 
                        wrapperClasses="table-responsive"
                        />
            </div>
        )
    }

}