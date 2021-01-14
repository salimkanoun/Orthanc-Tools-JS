import React, { Component } from "react"
import { connect } from "react-redux"
import Select from "react-select"

import papa from 'papaparse'

import apis from '../../services/apis'
import TableStudy from '../CommonComponents/RessourcesDisplay/TableStudy'
import TableSeries from '../CommonComponents/RessourcesDisplay/TableSeries'
import DownloadDropdown from "./DownloadDropdown"
import SendAetDropdown from "./SendAetDropdown"
import SendPeerDropdown from "./SendPeerDropdown"
import ModalWarning from './ModalWarning'

import { seriesArrayToStudyArray } from '../../tools/processResponse'
import { emptyExportList, removeSeriesFromExportList, removeStudyFromExportList } from '../../actions/ExportList'
import SendExternalDropdown from "./SendExternalDropdown"
import { toastifyError } from "../../services/toastify"

class ExportPanel extends Component {


    transferSyntaxOptions = [
        { value: 'None', label: 'None' },
        { value: '1.2.840.10008.1.2', label: 'Implicit VR Endian' },
        { value: '1.2.840.10008.1.2.1', label: 'Explicit VR Little Endian' },
        { value: '1.2.840.10008.1.2.1.99', label: 'Deflated Explicit VR Little Endian' },
        { value: '1.2.840.10008.1.2.2', label: 'Explicit VR Big Endian' },
        { value: '1.2.840.10008.1.2.4.50', label: 'JPEG 8-bit' },
        { value: '1.2.840.10008.1.2.4.51', label: 'JPEG 12-bit' },
        { value: '1.2.840.10008.1.2.4.57', label: 'JPEG Lossless' },
        { value: '1.2.840.10008.1.2.4.70', label: 'JPEG Lossless' },
        { value: '1.2.840.10008.1.2.4.80', label: 'JPEG-LS Lossless' },
        { value: '1.2.840.10008.1.2.4.81', label: 'JPEG-LS Lossy' },
        { value: '1.2.840.10008.1.2.4.90', label: 'JPEG 2000 (90)' },
        { value: '1.2.840.10008.1.2.4.91', label: 'JPEG 2000 (91)' },
        { value: '1.2.840.10008.1.2.4.92', label: 'JPEG 2000 (92)' },
        { value: '1.2.840.10008.1.2.4.93', label: 'JPEG 2000 (93)' }

    ]

    state = {
        currentStudy: '',
        currentTS: { value: '1.2.840.10008.1.2.1', label: 'Explicit VR Little Endian' },
        aets: [],
        peers: [],
        endpoints: [],
        show: false,
        button: ''
    }


    rowEvents = {
        onClick: (e, row, rowIndex) => {
            this.setState({ currentStudy: row.StudyOrthancID })
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
        let currentTS = apis.localStorage.getLocalStorage('TS');
        this.loadTS(currentTS);

        try {
            let aets = await apis.aets.getAets()
            let peers = await apis.peers.getPeers()
            let endpoints = await apis.endpoints.getEndpoints()
            this.setState({
                aets: aets,
                peers: peers,
                endpoints: endpoints
            })
        } catch (error) {
            toastifyError(error.statusText)
        }

    }

    getExportIDArray = () => {
        let ids = []
        this.props.exportList.seriesArray.forEach(serie => {
            ids.push(serie.ID)
        })
        return ids
    }

    handleClickFTP = () => {

    }

    handleClickWebDav = () => {

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


    getStudies = () => {
        let list = seriesArrayToStudyArray(this.props.exportList.seriesArray, this.props.exportList.studyArray)
        return list
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

    loadTS = (tsValue) => {
        if (tsValue) {
            this.setState({
                currentTS: this.getSelectedTSObject(tsValue)
            })
        }

    }

    setButton = (button) => {
        this.setState({
            button: button
        })
    }

    onTSChange = (item) => {
        apis.localStorage.setlocalStorage('TS', item.value)
        this.loadTS(item.value)
    }



    getSelectedTSObject = (tsValue) => {
        let filteredArray = this.transferSyntaxOptions.filter(item => {
            return item.value === tsValue ? true : false
        })

        return filteredArray[0]
    }

    getCSV = () => {

        if (this.props.exportList.seriesArray.length === 0) {
            toastifyError('Empty List')
            return;
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
            { type: 'text/csv;charset=utf-8' });
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
                        <TableStudy
                            ref={this.child}
                            wrapperClasses="table-responsive"
                            data={this.getStudies()}
                            rowEvents={this.rowEvents}
                            rowStyle={this.rowStyle}
                            hiddenActionBouton={true}
                            hiddenRemoveRow={true}
                            hiddenName={false}
                            hiddenID={false}
                            pagination={true}
                            hiddenAnonymized={false} />
                        <button type='button' className="btn btn-warning float-right" onClick={this.emptyList}>Empty List</button>
                    </div>

                    <div className="col-sm">
                        <TableSeries data={this.getSeries()} wrapperClasses="table-responsive" hiddenActionBouton={true} hiddenRemoveRow={false} onDelete={this.removeSeries} />
                        <button type='button' className="btn btn-danger float-right" onClick={this.removeStudy}>Remove Study</button>
                    </div>
                </div>
                <div className="row text-center mt-5">
                    <div className='col-sm'>
                        <DownloadDropdown exportIds={idArray} />
                        <Select single options={this.transferSyntaxOptions} onChange={this.onTSChange} name="ts_selector" value={this.state.currentTS} />
                    </div>
                    <div className='col-sm'>
                        <SendAetDropdown aets={this.state.aets} exportIds={idArray} />
                    </div>
                    <div className='col-sm'>
                        <SendPeerDropdown peers={this.state.peers} exportIds={idArray} needConfirm={confirm} setModal={() => this.setState({ show: true })} setButton={this.setButton} />
                    </div>
                    <div className='col-sm'>
                        <SendExternalDropdown endpoints={this.state.endpoints} exportIds={idArray} username={this.props.username} />
                    </div>
                    <div className='col-sm'>
                        <button type='button' className='btn btn-info' onClick={this.getCSV} > Download CSV Details </button>
                    </div>
                </div>
                <ModalWarning show={this.state.show} onHide={() => this.setState({ show: false })} button={this.state.button} />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        exportList: state.ExportList,
        orthancContent: state.OrthancContent.orthancContent,
        username: state.OrthancTools.username
    }
}

const mapDispatchToProps = {
    emptyExportList,
    removeStudyFromExportList,
    removeSeriesFromExportList
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportPanel)