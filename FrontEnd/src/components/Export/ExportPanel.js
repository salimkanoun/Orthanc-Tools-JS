import React, { Component } from "react"
import { connect } from "react-redux"

import TableStudy from '../CommonComponents/RessourcesDisplay/TableStudy'
import TableSeries from '../CommonComponents/RessourcesDisplay/TableSeries'
import apis from '../../services/apis'
import MonitorJob from '../../tools/MonitorJob'

import { seriesArrayToStudyArray } from '../../tools/processResponse'
import { emptyExportList, removeSeriesFromExportList, removeStudyFromExportList } from '../../actions/ExportList'
import Dropdown from "react-bootstrap/Dropdown"
import DownloadDropdown from "./DownloadDropdown"
import SendAetDropdown from "./SendAetDropdown"



class ExportPanel extends Component {
    
    state={
        currentStudy: '', 
        aets: [],
        peers: []
    }

    constructor(props){
        super(props)
        this.getStudies = this.getStudies.bind(this)
        this.emptyList = this.emptyList.bind(this)
        this.removeSeries = this.removeSeries.bind(this)
        this.removeStudy = this.removeStudy.bind(this)
        this.handleClickDownload = this.handleClickDownload.bind(this)
        this.handleClickPeer = this.handleClickPeer.bind(this)
        this.handleClickModalities = this.handleClickModalities.bind(this)
        this.child = React.createRef()
    }
    
    async componentDidMount(){
        let aets = await apis.aets.getAets()
        let peers = await apis.peers.getPeers()
        this.setState({
            aets: aets,
            peers: peers
        })
    }

    getExportIDArray(){
        let ids = []
        this.props.exportList.forEach(serie => {
            ids.push(serie.ID)
        })
        return ids
    }

    async handleClickDownload(e){
       let Ids = []
       this.props.exportList.forEach(serie => {
           Ids.push(serie.ID)
       })
       switch (e.currentTarget.id){
           case 'hirarchical':
                let jobAnswer = await apis.exportDicom.exportHirachicalDicoms(Ids)
                let jobMonitoring = new MonitorJob(jobAnswer.ID)
                jobMonitoring.onUpdate(function (progress) {
                    console.log(progress)
                })
                jobMonitoring.onFinish(function (state){
                    console.log(state)
                })
                jobMonitoring.startMonitoringJob()
                console.log('fin if')
               break
            case 'dicomdir':
                await apis.exportDicom.exportDicomDirDicoms(Ids)
                break
            default: 
                break
       }
    }

    async handleClickPeer(e){
        console.log(e.currentTarget.id)
        let Ids = []
        this.props.exportList.forEach(serie => {
            Ids.push(serie.ID)
        })
        await apis.peers.storePeer(e.currentTarget.id, Ids)
    }

    async getItemsPeers(){
        let namePeers = await apis.peers.getPeers()
        let items = []
        namePeers.forEach(name => {
            items.push(<button id={name} key={name} className='dropdown-item btn bg-info' type='button' onClick={ this.handleClickPeer } >{name}</button>)
        })
        this.setState({Peers: items})
    }

    async handleClickModalities(e){
        let Ids = []
        this.props.exportList.forEach(serie => {
            Ids.push(serie.ID)
        })
        await apis.aets.storeAET(e.currentTarget.id, Ids)
    }

    handleClickFTP(){

    }

    handleClickWebDav(){

    }
    
    removeSeries(serieID){
        this.props.removeSeriesFromExportList(serieID)
    }

    removeStudy(){
        this.props.removeStudyFromExportList(this.state.currentStudy)
    }

    emptyList(){
        this.props.emptyExportList()
    }

    rowEvents = {
        onClick: (e, row, rowIndex) => {
          this.setState({currentStudy: row.StudyOrthancID})
        }
      }

    rowStyle = (row, rowIndex) => {
        const style = {};
        if (row.StudyOrthancID === this.state.currentStudy){
            style.backgroundColor = 'rgba(255,153,51)'
        }
        style.borderTop = 'none';

        return style;
    }

    getStudies(){
        let list = seriesArrayToStudyArray(this.props.exportList, this.props.orthancContent)
        return list
    }

    getSeries(){
        
        let studies = []
        
        this.props.exportList.forEach(serie => {
            if (serie.ParentStudy === this.state.currentStudy){
                studies.push({
                    ...serie.MainDicomTags,
                    SeriesOrthancID: serie.ID,
                    Instances: serie.Instances.length
                })
        }})
        return studies
    }

    render() {
        return (
            <div className="jumbotron">
                <button type='button' className="btn btn-warning" onClick={this.emptyList}>Empty</button>
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
                            pagination={true} />
                    </div>
                    <div className="col-sm">
                        <TableSeries data={this.getSeries()} wrapperClasses="table-responsive" hiddenActionBouton={true} hiddenRemoveRow={false} onDelete={this.removeSeries}/>
                        <button type='button' className="btn btn-danger float-right" onClick={this.removeStudy}>Remove Study</button>
                    </div>
                </div>
                <div className="row text-center mt-5">
                    <div className='col-sm'>
                        <DownloadDropdown exportIds={this.getExportIDArray()} />
                    </div>
                    <div className='col-sm'>
                        <SendAetDropdown aets={this.state.aets} exportIds={this.getExportIDArray()} />
                    </div>
                    <div className='col-sm'>
                        <Dropdown >
                            <Dropdown.Toggle variant="success" id="dropdown-Peers" >
                                Send to Peers
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {this.state.Peers}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className='col-sm'>
                        <button type='button' className="btn btn-info" onClick={this.handleClickFTP}>Send To FTP</button>
                    </div>
                    <div className='col-sm'>
                        <button type='button' className="btn btn-info" onClick={this.handleClickWebDav}>Send To WebDav</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        exportList: state.ExportList.exportList, 
        orthancContent: state.OrthancContent.orthancContent 
    }
}

const mapDispatchToProps = {
    emptyExportList, 
    removeStudyFromExportList, 
    removeSeriesFromExportList
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportPanel)