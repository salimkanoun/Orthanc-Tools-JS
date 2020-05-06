import React, { Component } from "react"
import { connect } from "react-redux"

import TableStudy from '../CommonComponents/RessourcesDisplay/TableStudy'
import TableSeries from '../CommonComponents/RessourcesDisplay/TableSeries'
import apis from '../../services/apis'

import { seriesArrayToStudyArray } from '../../tools/processResponse'
import { emptyExportList, removeSeriesFromExportList, removeStudyFromExportList } from '../../actions/ExportList'
import Dropdown from "react-bootstrap/Dropdown"



class ExportPanel extends Component {
    
    state={
        currentStudy: '', 
        AET: [],
        Peers: []
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

    async componentWillMount(){
        this.getItemsAET()
        this.getItemsPeers()
    }

    async handleClickDownload(e){
       let Ids = []
       this.props.exportList.forEach(serie => {
           Ids.push(serie.ID)
       })
       switch (e.currentTarget.id){
           case 'hirarchical':
               await apis.exportDicom.exportHirachicalDicoms(Ids)
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
        namePeers.map(name => {
            items.push(<button id={name} key={name} className='dropdown-item btn bg-info' type='button' onClick={ this.handleClickPeer } >{name}</button>)
        })
        this.setState({Peers: items})
    }

    async getItemsAET(){
        let nameAets = await apis.aets.getAets()
        let items = []
        nameAets.map(name => {
            items.push(<button id={name} key={name} className='dropdown-item btn bg-info' type='button' onClick={ this.handleClickModalities } >{name}</button>)
        })
        this.setState({AET: items})
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
                        <TableSeries data={this.getSeries()} hiddenActionBouton={true} hiddenRemoveRow={false} onDelete={this.removeSeries}/>
                        <button type='button' className="btn btn-danger" onClick={this.removeStudy}>Remove Study</button>
                    </div>
                </div>
                <div className="row">
                    <div className='col col-sm-auto'>
                        <Dropdown >
                            <Dropdown.Toggle variant="success" id="dropdown-download" >
                                Download
                            </Dropdown.Toggle>

                            <Dropdown.Menu >
                                <button id='hirarchical' className='dropdown-item btn bg-info' type='button' onClick={ this.handleClickDownload } >Hirarchical</button>
                                <button id='dicomdir' className='dropdown-item btn bg-info' type='button' onClick={ this.handleClickDownload }>Dicomdir</button>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className='col col-sm-auto'>
                        <Dropdown >
                            <Dropdown.Toggle variant="success" id="dropdown-AET" >
                                Send to Modalities
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {this.state.AET}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className='col col-sm-auto'>
                        <Dropdown >
                            <Dropdown.Toggle variant="success" id="dropdown-Peers" >
                                Send to Peers
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {this.state.Peers}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className='col col-sm-auto'>
                        <button type='button' className="btn btn-info" onClick={this.handleClickFTP}>Send To FTP</button>
                    </div>
                    <div className='col col-sm-auto'>
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