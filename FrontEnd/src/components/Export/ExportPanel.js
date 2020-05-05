import React, { Component, Fragment } from "react"
import { connect } from "react-redux"

import TableStudy from '../CommonComponents/RessourcesDisplay/TableStudy'
import TableSeries from '../CommonComponents/RessourcesDisplay/TableSeries'

import { seriesArrayToStudyArray } from '../../tools/processResponse'



class ExportPanel extends Component {
    
    state={
        currentStudy: ''
    }

    constructor(props){
        super(props)
        this.getStudies = this.getStudies.bind(this)
        this.child = React.createRef()
    }

    handleClickDownload(){

    }

    handleClickPeer(){

    }

    handleClickModalities(){
        
    }

    handleClickFTP(){

    }

    handleClickWebDav(){

    }

    rowEvents = {
        onClick: (e, row, rowIndex) => {
            console.log(row)
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
        console.log(list)
        return list
    }

    getSeries(){
        
        let studies = []
        
        this.props.exportList.forEach(serie => {
            if (serie.ParentStudy === this.state.currentStudy){
                console.log()
                studies.push({
                    ...serie.MainDicomTags, 
                    Instances: serie.Instances.length
                })
        }})
        return studies
    }

    render() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-sm">
                        <TableStudy ref={this.child} data={this.getStudies()} rowEvents={this.rowEvents} rowStyle={this.rowStyle} hiddenActionBouton={true} hiddenRemoveRow={true}/>
                    </div>
                    <div className="col-sm">
                        <TableSeries data={this.getSeries()} hiddenActionBouton={true} hiddenRemoveRow={true} />
                    </div>
                </div>
                <div className="row">
                    <button type='button' className="btn btn-primary" onClick={this.handleClickDownload}>Download</button>
                    <button type='button' className="btn btn-primary" onClick={this.handleClickPeer}>Send To Peer</button>
                    <button type='button' className="btn btn-primary" onClick={this.handleClickModalities}>Send To Modalities</button>
                    <button type='button' className="btn btn-primary" onClick={this.handleClickFTP}>Send To FTP</button>
                    <button type='button' className="btn btn-primary" onClick={this.handleClickWebDav}>Send To WebDav</button>
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        exportList: state.ExportList.exportList, 
        orthancContent: state.OrthancContent.orthancContent 
    }
}

export default connect(mapStateToProps)(ExportPanel)