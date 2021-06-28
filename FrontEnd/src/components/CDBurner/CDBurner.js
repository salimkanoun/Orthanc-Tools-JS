import React, {Component, useMemo} from 'react'

import Badge from 'react-bootstrap/Badge'

import Toggle from 'react-toggle'

import apis from '../../services/apis'
import {ReactComponent as SpeakerSVG} from '../../assets/images/sounds.svg'
import {toast} from 'react-toastify';
import CommonTable from "../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

function BurnerJobsTables({jobs}) {
    const columns = useMemo(() => [
        {
            accessor: 'cdJobID',
            hidden: true
        },
        {
            accessor: 'timeStamp',
            sort: true,
            hidden: true
        },
        {
            accessor: 'patientName',
            Header: 'Patient Name'
        },
        {
            accessor: 'patientID',
            Header: 'Patient ID'
        },
        {
            accessor: 'patientDOB',
            Header: 'Patient Birth Date'
        },
        {
            accessor: 'studyDate',
            Header: 'Study Date'
        },
        {
            accessor: 'studyDescription',
            Header: 'Study Description'
        },
        {
            accessor: 'status',
            Header: 'CD Status'
        },
        {
            id: 'cancelButton',
            Header: 'Cancel',
            Cell: ({row}) => {
                let disable = (row.values.status === CDBurner.JOB_STATUS_BURNING_DONE || row.values.status === CDBurner.JOB_STATUS_BURNING_ERROR)
                return (
                    <div className="text-center">
                        <input type="button" className='btn btn-danger' onClick={async () => {
                            try {
                                await apis.cdBurner.cancelCdBurner(row.cdJobID)
                            } catch (error) {
                                toast.error(error.statusText)
                            }

                        }} value="Cancel" disabled={disable}/>
                    </div>
                )
            }
        }
    ], []);

    return <CommonTable columns={columns} tableData={jobs}/>
}

export default class CDBurner extends Component {

    audioSuccess = new Audio('/sounds/cd_Success.wav')
    audioFailure = new Audio('/sounds/cd_Error.wav')

    state = {
        robotStarted: false,
        burnerJobs: [],
        firstRefresh: false,
        playSound: false,
        queuededJobs: 0
    }
    refreshTableData = async () => {

        let cdBurnerData
        try {
            cdBurnerData = await apis.cdBurner.getCdBuner()
        } catch (error) {
            toast.error(error.statusText)
            return
        }

        let jobs = cdBurnerData.Jobs

        let newTablearray = []
        if (jobs != null) {

            Object.keys(jobs).forEach(jobKey => {

                //If sounds enabled search for Failure or completion to play sound
                if (this.state.playSound) {

                    let jobItem = this.state.burnerJobs.filter(job => {
                        return (job.cdJobID === jobKey)
                    })

                    if (jobItem.length === 1 && jobItem[0]['status'] !== jobs[jobKey]['status']) {
                        if (jobs[jobKey]['status'] === CDBurner.JOB_STATUS_BURNING_DONE) {
                            this.audioSuccess.play()
                        } else if (jobs[jobKey]['status'] === CDBurner.JOB_STATUS_BURNING_ERROR) {
                            this.audioFailure.play()
                        }
                    }
                }

                newTablearray.push({
                    cdJobID: jobKey,
                    status: jobs[jobKey]['status'],
                    ...jobs[jobKey]['details']
                })

            })

        }

        this.setState({
            firstRefresh: true,
            robotStarted: cdBurnerData.CdBurnerService,
            burnerJobs: newTablearray,
            queuededJobs: cdBurnerData.QuededJobs
        })

    }

    toogleHandler = async (event) => {
        let startStatus = this.state.robotStarted

        try {
            let newStatus
            if (!startStatus) {
                await apis.cdBurner.startCdBurnerService()
                newStatus = true
            } else {
                await apis.cdBurner.stopCdBurnerService()
                newStatus = false
            }

            this.setState({
                robotStarted: newStatus
            })

        } catch (error) {
            let message = await error.json()
            toast.error(message.errorMessage)
        }


    }

    soundHandler = (e) => {
        localStorage.setItem('BurnerSounds', (e.target.checked).toString())
        this.setState({
            playSound: (e.target.checked)
        })

    }

    componentDidMount = async () => {
        let playSound = localStorage.getItem('BurnerSounds') === 'true'
        this.setState({
            playSound: playSound
        })
        await this.refreshTableData()
        this.updateInterval = setInterval(this.refreshTableData, 2000)
    }

    componentWillUnmount = () => {
        clearInterval(this.updateInterval)
    }

    render = () => {
        return (
            <div className='jumbotron'>
                <div className="row mb-3">
                    <div className="col-10">
                        <div className="row">
                            <div className="col">
                                <h2>CD Burner Service</h2>
                            </div>
                            <div className="col">
                                <Toggle checked={this.state.robotStarted} onChange={this.toogleHandler}
                                        disabled={!this.state.firstRefresh}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                        <SpeakerSVG className="mr-3" style={{height: '30px', width: '30px'}}/>
                        <Toggle checked={this.state.playSound} onChange={this.soundHandler}/>

                    </div>
                </div>
                <div className="mb-3 float-right">
                    <Badge variant="info"> Queuded Jobs : {this.state.queuededJobs} </Badge>
                </div>
                <BurnerJobsTables jobs={this.state.burnerJobs}/>
            </div>
        )
    }

}

CDBurner.JOB_STATUS_BURNING_ERROR = "Burning Error"
CDBurner.JOB_STATUS_BURNING_DONE = "Burning Done"