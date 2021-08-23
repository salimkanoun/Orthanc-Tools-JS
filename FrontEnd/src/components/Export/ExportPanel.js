import React, {Component, useMemo, Fragment} from "react"
import {connect} from "react-redux"

import papa from 'papaparse'

import apis from '../../services/apis'
import TableStudy from '../CommonComponents/RessourcesDisplay/ReactTable/TableStudy'
import TableSeries from '../CommonComponents/RessourcesDisplay/ReactTable/TableSeries'
import DownloadDropdown from "./DownloadDropdown"
import SendAetDropdown from "./SendAetDropdown"
import SendPeerDropdown from "./SendPeerDropdown"
import ModalWarning from './ModalWarning'

import {seriesArrayToStudyArray} from '../../tools/processResponse'
import {emptyExportList, removeSeriesFromExportList, removeStudyFromExportList} from '../../actions/ExportList'
import SendExternalDropdown from "./SendExternalDropdown"
import {toast} from "react-toastify"
import { Row, Col, Dropdown, ButtonGroup } from "react-bootstrap"

/**
 * This componnent wrapper allows to optimise the table by memoizing data
 * because getStudies return a different object everytime the component state updates
 * @param series list of series contained by the studies
 * @param studies list of the studies
 * @param props props required by the table
 * @returns {JSX.Element} The table
 */
function TableStudyWrapper({series, studies, ...props}) {
    const data = useMemo(() => seriesArrayToStudyArray(series, studies), [series, studies]);
    return <TableStudy studies={data} {...props}/>
}

function TableSeriesWrapper({series, selectedStudy, ...props}) {
    const data = useMemo(() => series
        .filter(serie => serie.ParentStudy === selectedStudy)
        .map(serie => ({
            ...serie.MainDicomTags,
            SeriesOrthancID: serie.ID,
            Instances: serie.Instances.length
        })), [series, selectedStudy]);
    return <TableSeries series={data} {...props}/>
}

class ExportPanel extends Component {
    state = {
        currentStudy: '',
        currentTS: null,
        aets: [],
        peers: [],
        endpoints: [],
        show: false,
        button: ''
    }

    rowEvents = {
        onClick: (e, row, rowIndex) => {
            this.setState({currentStudy: row.StudyOrthancID})
        }
    }

    rowStyle = (row, rowIndex) => {
        const style = {};
        if (row.StudyOrthancID === this.state.currentStudy) {
            style.backgroundColor = 'rgba(255,153,51)'
        }
        style.borderTop = 'none';

        return style;
    }

    componentDidMount = async () => {

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

            this.setState({
                aets: aets,
                peers: peers,
                endpoints: endpoints,
                currentTS: TS
            })


        } catch (error) {
            this.setState({
                aets: []
            })
            toast.error(error.statusText)
        }

    }

    getExportIDArray = () => {
        let ids = []
        this.props.exportList.seriesArray.forEach(serie => {
            ids.push(serie.ID)
        })
        return ids
    }

    removeSeries = (serieID) => {
        this.props.removeSeriesFromExportList(serieID)
    }

    removeStudy = () => {
        this.props.removeStudyFromExportList(this.state.currentStudy)
    }

    emptyList = () => {
        this.props.emptyExportList()
    }

    getSeries = () => {
        let studies = []
        this.props.exportList.seriesArray.forEach(serie => {
            if (serie.ParentStudy === this.state.currentStudy) {
                studies.push({
                    ...serie.MainDicomTags,
                    SeriesOrthancID: serie.ID,
                    Instances: serie.Instances.length
                })
            }
        })
        return studies
    }

    confirm = () => {
        let answer = false
        this.props.exportList.studyArray.forEach(study => {
            if (study.AnonymizedFrom === undefined || study.AnonymizedFrom === '') {
                answer = true
            }
        })
        return answer
    }

    setButton = (button) => {
        this.setState({
            button: button
        })
    }

    getCSV = () => {

        if (this.props.exportList.seriesArray.length === 0) {
            toast.error('Empty List')
            return
        }

        let csvData = []

        this.props.exportList.seriesArray.forEach((series) => {
            let studydata = this.props.exportList.studyArray.filter((study) => {
                return study.ID === series.ParentStudy
            })

            csvData.push({
                patientId: studydata[0].PatientMainDicomTags.PatientID,
                patientName: studydata[0].PatientMainDicomTags.PatientName,
                studyDescription: studydata[0].MainDicomTags.StudyDescription,
                seriesNumber: series.MainDicomTags.SeriesNumber,
                seriesDate: series.MainDicomTags.SeriesDate,
                seriesTime: series.MainDicomTags.SeriesTime,
                seriesModality: series.MainDicomTags.Modality,
                numberOfInstances: series.Instances.length,
                seriesDescription: series.MainDicomTags.SeriesDescription,
                seriesInstanceUID: series.MainDicomTags.SeriesInstanceUID,
                studyInstanceUID: studydata[0].MainDicomTags.StudyInstanceUID,

            })
        });

        let csvString = papa.unparse(csvData)

        const element = document.createElement("a");
        const file = new Blob([csvString],
            {type: 'text/csv;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = "ExportDicomDetails.csv";
        document.body.appendChild(element);
        element.click();

    }

    render = () => {
        let idArray = this.getExportIDArray()
        let confirm = this.confirm()
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
                                    <SendAetDropdown aets={this.state.aets} exportIds={idArray}/>
                                </Dropdown.Item>
                                <Dropdown.Item className="mt-2">
                                    <SendPeerDropdown peers={this.state.peers} exportIds={idArray} needConfirm={confirm}
                                                    setModal={() => this.setState({show: true})} setButton={this.setButton}/>
                                </Dropdown.Item >
                                <Dropdown.Item className="mt-2" >
                                    <SendExternalDropdown endpoints={this.state.endpoints} exportIds={idArray}
                                                        username={this.props.username}/>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    
                </Row>
                <Row className="mt-5">
                    <Col sm>
                        <TableStudyWrapper
                            studies={this.props.exportList.studyArray}
                            series={this.props.exportList.seriesArray}
                            rowEvents={this.rowEvents}
                            rowStyle={this.rowStyle}
                            hiddenActionBouton={true}
                            hiddenRemoveRow={true}
                            hiddenName={false}
                            hiddenID={false}
                            pagination={true}
                            hiddenAnonymized={false}/>
                        
                    </Col>

                    <Col sm>
                        <TableSeriesWrapper series={this.props.exportList.seriesArray}
                                            selectedStudy={this.state.currentStudy}
                                            hiddenActionBouton={true}
                                            hiddenRemoveRow={false} onDelete={this.removeSeries}/>
                        
                    </Col>
                </Row>
                <Row className="text-start mt-5">
                    <Col sm>
                        <button type='button' className='otjs-button otjs-button-red mt-2 w-7' onClick={this.emptyList}>
                            Empty List
                        </button>
                    </Col>
                    <Col sm>
                        <button type='button' className='otjs-button otjs-button-red mt-2 w-10' onClick={this.removeStudy}>
                            Remove Study
                        </button>
                    </Col>
                    
                </Row>
                <Row className="text-center mt-5 pt-5 border-top border-2">
                    <Col sm>
                        <DownloadDropdown exportIds={idArray} TS={this.state.currentTS}/>
                    </Col>
                    <Col>
                        <button type='button' className="otjs-button otjs-button-blue w-12" onClick={this.getCSV}> 
                            Download CSV Details
                        </button>
                    </Col>
                </Row>
                <ModalWarning show={this.state.show} onHide={() => this.setState({show: false})}
                              button={this.state.button}/>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        exportList: state.ExportList,
        username: state.OrthancTools.username
    }
}

const mapDispatchToProps = {
    emptyExportList,
    removeStudyFromExportList,
    removeSeriesFromExportList
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportPanel)