import React, {Component, useMemo} from 'react'

import {Row, Col, Badge} from 'react-bootstrap'

import Toggle from 'react-toggle'

import apis from '../../services/apis'
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
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
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
            <div>
                <Row className="border-bottom border-2 pb-3 align-items-center">
                    <Col sm={8} className="d-flex justify-content-start align-items-center">
                        <i className="fas fa-compact-disc ico me-3"></i><h2 className="card-title">CD Burner Service</h2>
                    </Col>
                    <Col sm={2}>
                        <Toggle checked={this.state.robotStarted} onChange={this.toogleHandler}
                                        disabled={!this.state.firstRefresh}/>
                    </Col>
                    <Col sm={2} className="d-flex justify-content-start align-items-center">
                        <h4>
                            <i id="soundIcone" className={this.state.playSound === true ? "fas fa-volume-up me-2" : "fas fa-volume-mute me-2"}></i>
                        </h4>
                        <Toggle checked={this.state.playSound} onChange={this.soundHandler}/>
                    </Col>
                </Row>

                <div className="mb-3 float-right">
                    <Badge variant="info"> Queuded Jobs : {this.state.queuededJobs} </Badge>
                </div>
                <Row className="mt-5">
                    <Col>
                        <BurnerJobsTables jobs={this.state.burnerJobs}/>
                    </Col>
                </Row>
            </div>
        )
    }

}

CDBurner.JOB_STATUS_BURNING_ERROR = "Burning Error"
CDBurner.JOB_STATUS_BURNING_DONE = "Burning Done"