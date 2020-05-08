import React, { Component } from 'react'
import MonitorJob from '../../tools/MonitorJob'
import apis from '../../services/apis'

/**
 * Export Button to retrieve Orthanc Ressources to client
 * Props : 
 *  exportType (see ExportButton constants)
 *  orthancIds : array of OrthancIDs to be exported
 */
export default class ExportButton extends Component {

  constructor(props) {
    super(props)
    this.doExport = this.doExport.bind(this)
  }

  render() {
    return (
      <div className='col-sm'>
        <input type='button' className='btn btn-info btn-large' onClick={this.doExport} disabled={this.props.disable} value='Export' />
      </div>)
  }

  async doExport() {

    if (this.props.exportType === ExportButton.HIRACHICAL) {
      console.log('ici hierachique')
      let jobAnswer = await apis.exportDicom.exportHirachicalDicoms(this.props.orthancIds)
      console.log('ici post api')
      console.log(jobAnswer)
      let jobMonitoring = new MonitorJob(jobAnswer.ID)
      jobMonitoring.onUpdate(function (progress){
        console.log(progress)
      })
      jobMonitoring.onFinish(function (state){
        console.log(state)
      })
      console.log('fin if')

    } else if (this.props.exportType === ExportButton.DICOMDIR) {

      apis.exportDicom.exportDicomDirDicoms(this.props.orthancIds)

    }

  }

}

ExportButton.HIRACHICAL = 0
ExportButton.DICOMDIR = 1
