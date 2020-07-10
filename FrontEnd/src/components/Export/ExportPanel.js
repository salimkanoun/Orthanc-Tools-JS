import React, { Component } from "react"
import { connect } from "react-redux"

import apis from '../../services/apis'
import TableStudy from '../CommonComponents/RessourcesDisplay/TableStudy'
import TableSeries from '../CommonComponents/RessourcesDisplay/TableSeries'
import DownloadDropdown from "./DownloadDropdown"
import SendAetDropdown from "./SendAetDropdown"
import SendPeerDropdown from "./SendPeerDropdown"
import TranscodeSelector from './TranscodeSelector'
import ModalWarning from './ModalWarning'

import { seriesArrayToStudyArray } from '../../tools/processResponse'
import { emptyExportList, removeSeriesFromExportList, removeStudyFromExportList } from '../../actions/ExportList'

class ExportPanel extends Component {
    
    state={
        currentStudy: '', 
        aets: [],
        peers: [], 
        show: false, 
        button: ''
    }

    constructor(props){
        super(props)
        this.getStudies = this.getStudies.bind(this)
        this.emptyList = this.emptyList.bind(this)
        this.removeSeries = this.removeSeries.bind(this)
        this.removeStudy = this.removeStudy.bind(this)
        this.confirm = this.confirm.bind(this)
        this.setButton = this.setButton.bind(this)
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
        this.props.exportList.seriesArray.forEach(serie => {
            ids.push(serie.ID)
        })
        return ids
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
        let list = seriesArrayToStudyArray(this.props.exportList.seriesArray, this.props.exportList.studyArray)
        return list
    }

    getSeries(){
        
        let studies = []
        
        this.props.exportList.seriesArray.forEach(serie => {
            if (serie.ParentStudy === this.state.currentStudy){
                studies.push({
                    ...serie.MainDicomTags,
                    SeriesOrthancID: serie.ID,
                    Instances: serie.Instances.length
                })
            }})
            return studies
        }

        confirm(){
            let answer = false
            this.props.exportList.studyArray.forEach(study => {
                if (study.AnonymizedFrom === undefined || study.AnonymizedFrom === ''){
                    answer = true
                }
            })
            return answer
        }
    
        setButton(button){
            this.setState({
                button: button
            })
        }
    
    
        render() {
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
                            hiddenAnonymized={false}/>
                            <button type='button' className="btn btn-warning float-right" onClick={this.emptyList}>Empty List</button>
                    </div>

                    <div className="col-sm">
                        <TableSeries data={this.getSeries()} wrapperClasses="table-responsive" hiddenActionBouton={true} hiddenRemoveRow={false} onDelete={this.removeSeries}/>
                        <button type='button' className="btn btn-danger float-right" onClick={this.removeStudy}>Remove Study</button>
                    </div>
                </div>
                <div className="row text-center mt-5">
                    <div className='col-sm'>
                        <DownloadDropdown exportIds={idArray} />
                        <TranscodeSelector />
                    </div>
                    <div className='col-sm'>
                        <SendAetDropdown aets={this.state.aets} exportIds={idArray} />
                    </div>
                    <div className='col-sm'>
                        <SendPeerDropdown peers={this.state.peers} exportIds={idArray} needConfirm={confirm} setModal={() => this.setState({show: true})} setButton={this.setButton} />
                    </div>
                    <div className='col-sm'>
                        <button type='button' className="btn btn-info" onClick={this.handleClickFTP} disabled>Send To FTP</button>
                    </div>
                    <div className='col-sm'>
                        <button type='button' className="btn btn-info" onClick={this.handleClickWebDav} disabled>Send To WebDav</button>
                    </div>
                </div>
                <ModalWarning show={this.state.show} onHide={() => this.setState({show: false})} button={this.state.button} />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        exportList: state.ExportList, 
        orthancContent: state.OrthancContent.orthancContent 
    }
}

const mapDispatchToProps = {
    emptyExportList, 
    removeStudyFromExportList, 
    removeSeriesFromExportList
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportPanel)