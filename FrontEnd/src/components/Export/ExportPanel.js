import React, { Component, useMemo, Fragment, useState } from "react"
import { connect, useDispatch, useSelector } from "react-redux"

import papa from 'papaparse'

import apis from '../../services/apis'
import TableSeries from '../CommonComponents/RessourcesDisplay/ReactTable/TableSeries'
import DownloadDropdown from "./DownloadDropdown"
import SendAetDropdown from "./SendAetDropdown"
import SendPeerDropdown from "./SendPeerDropdown"
import ModalWarning from './ModalWarning'

import { seriesArrayToStudyArray } from '../../tools/processResponse'
import { emptyExportList, removeSeriesFromExportList, removeStudyFromExportList } from '../../actions/ExportList'
import SendExternalDropdown from "./SendExternalDropdown"
import { toast } from "react-toastify"
import { Row, Col, Dropdown, ButtonGroup } from "react-bootstrap"
import TableStudies from "../CommonComponents/RessourcesDisplay/ReactTable/TableStudies"
import Series from "../../model/Series"

/**
 * This componnent wrapper allows to optimise the table by memoizing data
 * because getStudies return a different object everytime the component state updates
 * @param series list of series contained by the studies
 * @param studies list of the studies
 * @param props props required by the table
 * @returns {JSX.Element} The table
 */


export default function ExportPanel() {

    const [currentStudy, setCurrentStudy] = useState('')
    const [currentTS, setCurrentTS] = useState(null)
    const [aets, setAets] = useState([])
    const [peers, setPeers] = useState([])
    const [endpoints, setEndpoints] = useState([])
    const [show, setShow] = useState(false)
    const [button, setButton] = useState('')


    const onClickStudyHandler = (StudyOrthancID) => {
        setCurrentStudy(StudyOrthancID)
    }

    const store = useSelector(state => {
        return {
            exportList: state.ExportList,
            username: state.OrthancTools.username
        }
    })

    const dispatch = useDispatch()

    const rowStyle = (StudyOrthancID) => {
        if (StudyOrthancID === currentStudy) return { background: 'peachPuff' }
    }

    const componentDidMount = async () => {

        try {
            let aets = await apis.aets.getAets()
            let peers = await apis.peers.getPeers()
            let endpoints = await apis.endpoints.getEndpoints()
            let TS = await apis.options.getExportOption()

            endpoints.push({
                id: -1,
                label: 'On Server Hard Disk',
                protocol: 'local',
            })

            setAets(aets)
            setPeers(peers)
            setEndpoints(endpoints)
            setCurrentTS(TS)

        } catch (error) {
            setAets([])
            toast.error(error.statusText)
        }

    }

    const getExportIDArray = () => {
        let ids = []
        store.exportList.seriesArray.forEach(serie => {
            ids.push(serie.SeriesOrthancID)
        })
        return ids
    }

    const removeSeries = (seriesOrthancID) => {
        dispatch(removeSeriesFromExportList(seriesOrthancID))
    }

    const removeStudy = () => {
        dispatch(removeStudyFromExportList(currentStudy))
    }

    const emptyList = () => {
        dispatch(emptyExportList())
    }

    const confirm = () => {
        let answer = false
        store.exportList.studyArray.forEach(study => {
            if (study.AnonymizedFrom === undefined || study.AnonymizedFrom === '') {
                answer = true
            }
        })
        return answer
    }

    const setButtons = (button) => {
        setButton(button)
    }

    const getCSV = () => {

        if (store.exportList.seriesArray.length === 0) {
            toast.error('Empty List')
            return
        }

        let csvData = []

        store.exportList.seriesArray.forEach((series) => {
            let studydata = store.exportList.studyArray.find((study) => {
                return study.StudyOrthancID === series.StudyOrthancID
            })

            csvData.push({
                patientId: studydata.ParentPatient.PatientID,
                patientName: studydata.ParentPatient.PatientName,
                studyDescription: studydata.StudyDescription,
                seriesNumber: series.SeriesNumber,
                seriesDate: series.SeriesDate,
                seriesTime: series.SeriesTime,
                seriesModality: series.Modality,
                numberOfInstances: series.NumberOfInstances,
                seriesDescription: series.SeriesDescription,
                seriesInstanceUID: series.SeriesInstanceUID,
                studyInstanceUID: studydata.StudyInstanceUID,

            })
        });

        let csvString = papa.unparse(csvData)

        const element = document.createElement("a");
        const file = new Blob([csvString],
            { type: 'text/csv;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = "ExportDicomDetails.csv";
        document.body.appendChild(element);
        element.click();

    }

    const data = useMemo(() => store.exportList.seriesArray.filter(serie => serie.StudyOrthancID === currentStudy)
        , [currentStudy, store.exportList.seriesArray]);

    let idArray = getExportIDArray()
    let constConfirm = confirm()
    return (
        <Fragment>
            <Row className="border-bottom border-2 pb-3">
                <Col className="d-flex justify-content-start align-items-center">
                    <i className="fas fa-file-export ico me-3"></i><h2 className="card-title">Export</h2>
                </Col>
            </Row>
            <Row className="text-end">
                <Col>
                    <Dropdown as={ButtonGroup} autoClose="outside" className="mt-2">
                        <Dropdown.Toggle variant="button-dropdown-orange" className="button-dropdown button-dropdown-orange w-10" id="dropdown-autoclose-outside">
                            Send
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="mt-2 border border-dark border-2">
                            <Dropdown.Item >
                                <SendAetDropdown aets={aets} exportIds={idArray} />
                            </Dropdown.Item>
                            <Dropdown.Item className="mt-2">
                                <SendPeerDropdown peers={peers} exportIds={idArray} needConfirm={constConfirm}
                                    setModal={() => setShow(true)} setButton={setButtons} />
                            </Dropdown.Item >
                            <Dropdown.Item className="mt-2" >
                                <SendExternalDropdown endpoints={endpoints} exportIds={idArray}
                                    username={store.username} />
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>

            </Row>
            <Row className="mt-5">
                <Col sm>
                    <TableStudies
                        studies={store.exportList.studyArray}
                        onRowClick={onClickStudyHandler}
                        rowStyle={rowStyle}
                        actionBouton={false}
                        removeRow={false}
                        pagination={true}
                        hiddenAnonymized={false}
                        withPatientColums={true} />

                </Col>

                <Col sm>
                    <TableSeries series={data}
                        removeRow onRemove={removeSeries} />

                </Col>
            </Row>
            <Row className="text-start mt-5">
                <Col sm>
                    <button type='button' className='otjs-button otjs-button-red mt-2 w-7' onClick={emptyList}>
                        Empty List
                    </button>
                </Col>
                <Col sm>
                    <button type='button' className='otjs-button otjs-button-red mt-2 w-10' onClick={removeStudy}>
                        Remove Study
                    </button>
                </Col>

            </Row>
            <Row className="text-center mt-5 pt-5 border-top border-2">
                <Col sm>
                    <DownloadDropdown exportIds={idArray} TS={currentTS} />
                </Col>
                <Col>
                    <button type='button' className="otjs-button otjs-button-blue w-12" onClick={getCSV}>
                        Download CSV Details
                    </button>
                </Col>
            </Row>
            <ModalWarning show={show} onHide={() => setShow(false)}
                button={button} />
        </Fragment>
    )
}
