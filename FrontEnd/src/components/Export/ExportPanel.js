import React, {Component, useMemo} from "react"
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
            <div className="jumbotron">
                <h2 className="card-title mb-3">Export</h2>
                <div className="row">
                    <div className="col-sm">
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
                        <button type='button' className="btn btn-warning float-right" onClick={this.emptyList}>Empty
                            List
                        </button>
                    </div>

                    <div className="col-sm">
                        <TableSeriesWrapper series={this.props.exportList.seriesArray}
                                            selectedStudy={this.state.currentStudy}
                                            hiddenActionBouton={true}
                                            hiddenRemoveRow={false} onDelete={this.removeSeries}/>
                        <button type='button' className="btn btn-danger float-right" onClick={this.removeStudy}>Remove
                            Study
                        </button>
                    </div>
                </div>
                <div className="row text-center mt-5">
                    <div className='col-sm'>
                        <DownloadDropdown exportIds={idArray} TS={this.state.currentTS}/>
                    </div>
                    <div className='col-sm'>
                        <SendAetDropdown aets={this.state.aets} exportIds={idArray}/>
                    </div>
                    <div className='col-sm'>
                        <SendPeerDropdown peers={this.state.peers} exportIds={idArray} needConfirm={confirm}
                                          setModal={() => this.setState({show: true})} setButton={this.setButton}/>
                    </div>
                    <div className='col-sm'>
                        <SendExternalDropdown endpoints={this.state.endpoints} exportIds={idArray}
                                              username={this.props.username}/>
                    </div>
                    <div className='col-sm'>
                        <button type='button' className='btn btn-info' onClick={this.getCSV}> Download CSV Details
                        </button>
                    </div>
                </div>
                <ModalWarning show={this.state.show} onHide={() => this.setState({show: false})}
                              button={this.state.button}/>
            </div>
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