import React, { useEffect, useState } from 'react'

import { Row, Col, Badge, Container } from 'react-bootstrap'
import Toggle from 'react-toggle'

import CDBurnerTable from './CDBurnerTable';

import apis from '../../services/apis'
import { errorMessage } from '../../tools/toastify';

const audioSuccess = new Audio('/sounds/cd_Success.wav')
const audioFailure = new Audio('/sounds/cd_Error.wav')
const JOB_STATUS_BURNING_ERROR = "Burning Error"
const JOB_STATUS_BURNING_DONE = "Burning Done"

export default () => {

    const [robotStarted, setRobotStarted] = useState(false)
    const [burnerJobs, setBurnerJobs] = useState([])
    const [firstRefresh, setFirstRefresh] = useState(false)
    const [playSound, setPlaySound] = useState(false)
    const [queuededJobs, setQueudedJobs] = useState(0)

    const refreshTableData = async () => {

        let cdBurnerData
        try {
            cdBurnerData = await apis.cdBurner.getCdBuner()
        } catch (error) {
            errorMessage(error?.data?.errorMessage ?? "Error fetching CDBurner service")
            return
        }

        let jobs = cdBurnerData.Jobs

        let newTablearray = []
        if (jobs != null) {

            Object.keys(jobs).forEach(jobKey => {

                //If sounds enabled search for Failure or completion to play sound
                if (playSound) {

                    let jobItem = burnerJobs.filter(job => {
                        return (job.cdJobID === jobKey)
                    })

                    if (jobItem.length === 1 && jobItem[0]['status'] !== jobs[jobKey]['status']) {
                        if (jobs[jobKey]['status'] === JOB_STATUS_BURNING_DONE) {
                            audioSuccess.play()
                        } else if (jobs[jobKey]['status'] === JOB_STATUS_BURNING_ERROR) {
                            audioFailure.play()
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

        setFirstRefresh(true)
        setRobotStarted(cdBurnerData.CdBurnerService)
        setBurnerJobs(newTablearray)
        setQueudedJobs(cdBurnerData.QuededJobs)
    }

    const toogleHandler = async () => {
        let startStatus = robotStarted

        try {
            let newStatus
            if (!startStatus) {
                await apis.cdBurner.startCdBurnerService()
                newStatus = true
            } else {
                await apis.cdBurner.stopCdBurnerService()
                newStatus = false
            }

            setRobotStarted(newStatus)

        } catch (error) {
            errorMessage(error?.data?.errorMessage ?? "Failed updating burner service")
        }
    }

    const soundHandler = (e) => {
        let activated = e.target.checked
        localStorage.setItem('BurnerSounds', (activated).toString())
        setPlaySound(activated)
    }

    useEffect(() => {
        let playSound = localStorage.getItem('BurnerSounds') === 'true'
        setPlaySound(playSound)
        refreshTableData()
        const updateInterval = setInterval(refreshTableData, 2000)
        return () => {
            clearInterval(updateInterval)
        }
    }, [])

    return (
        <Container fluid>
            <Row className="border-bottom border-2 pb-3 align-items-center">
                <Col sm={8} className="d-flex justify-content-start align-items-center">
                    <i className="fas fa-compact-disc ico me-3"></i>
                    <h2 className="card-title">CD Burner Service</h2>
                </Col>
                <Col sm={2}>
                    <Toggle checked={robotStarted} onChange={toogleHandler}
                        disabled={!firstRefresh} />
                </Col>
                <Col sm={2} className="d-flex justify-content-start align-items-center">
                    <h4>
                        <i id="soundIcon" className={playSound === true ? "fas fa-volume-up me-2" : "fas fa-volume-mute me-2"}></i>
                    </h4>
                    <Toggle checked={playSound} onChange={soundHandler} />
                </Col>
            </Row>

            <Row className="mb-3 float-right">
                <Badge variant="info"> Queuded Jobs : {queuededJobs} </Badge>
            </Row>
            <Row className="mt-5">
                <Col>
                    <CDBurnerTable jobs={burnerJobs} />
                </Col>
            </Row>
        </Container>
    )
}