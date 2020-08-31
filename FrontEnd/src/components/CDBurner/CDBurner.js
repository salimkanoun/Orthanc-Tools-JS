
import React, { Component } from 'react'

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator'

import Toggle from 'react-toggle'

import apis from '../../services/apis'
import { ReactComponent as SpeakerSVG } from '../../images/sounds.svg'

export default class CDBurner extends Component {

    constructor(props){
        super(props)
        this.toogleHandler = this.toogleHandler.bind(this)
        this.refreshTableData = this.refreshTableData.bind(this)
        this.soundHandler = this.soundHandler.bind(this)
        this.audioFailure = new Audio('/sounds/cd_Error.wav')
        this.audioSuccess = new Audio('/sounds/cd_Success.wav')
    }

    state = {
        robotStarted : false,
        burnerJobs : [],
        firstRefresh : false,
        playSound : false
    }

    async refreshTableData(){

        let cdBurnerData = await apis.cdBurner.getCdBuner()
        let jobs = cdBurnerData.Jobs

        let newTablearray = []

        //this.audioFailure.play()
        Object.keys(jobs).forEach(jobKey =>{

            //If sounds enabled search for Failure or completion to play sound
            if(this.state.playSound){

                let jobItem = this.state.burnerJobs.filter(job => {
                    return (job.cdJobID === jobKey)
                })
    
                if(jobItem.length ===1 && jobItem[0]['status'] !== jobs[jobKey]['status']){
                    if(jobs[jobKey]['status'] === CDBurner.JOB_STATUS_BURNING_DONE){
                        this.audioSuccess.play()
                    }else if(jobs[jobKey]['status'] === CDBurner.JOB_STATUS_BURNING_ERROR){
                        this.audioFailure.play()
                    }
                }
            }

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

    soundHandler(){
        let playSound = apis.localStorage.getLocalStorage('BurnerSounds') === 'true'
        apis.localStorage.setlocalStorage('BurnerSounds', (!playSound).toString() )
        this.setState({
            playSound : !playSound
        })
    }

   async componentDidMount(){
        let playSound = apis.localStorage.getLocalStorage('BurnerSounds') === 'true'
        this.setState({
            playSound : playSound
        })
        await this.refreshTableData()
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

    cancelCDButton(cell, row, rowIndex, formatExtraData){
        let disable = (row.status === CDBurner.JOB_STATUS_BURNING_DONE || row.status === CDBurner.JOB_STATUS_BURNING_ERROR)
        return (
            <div className="text-center">
                <input type="button" className='btn btn-danger' onClick = {() => apis.cdBurner.cancelCdBurner(row.cdJobID)} value = "Cancel" disabled = {disable} />
            </div>
        )
    }

    render(){

        return (
            
            <div className='jumbotron'>
                <div className = "row mb-3">
                    <div className = "col-10">
                            <div className = "row">
                                <div className="col">
                                    <h2>CD Burner Service</h2>
                                </div>
                                <div className="col">
                                    <Toggle checked={this.state.robotStarted} onChange={this.toogleHandler} disabled = {!this.state.firstRefresh}/> 
                                </div>
                            </div>
                    </div>
                    <div className = "col-2">
                        <SpeakerSVG className = "mr-3" style={{height:'30px', width: '30px'}} />
                        <Toggle checked={this.state.playSound} onChange={this.soundHandler}/> 
                        
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

CDBurner.JOB_STATUS_BURNING_ERROR = "Burning Error"
CDBurner.JOB_STATUS_BURNING_DONE = "Burning Done"