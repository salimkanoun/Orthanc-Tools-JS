import React, { Component } from 'react'
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

      apis.exportDicom.exportHirachicalDicoms(this.props.orthancIds)

    } else if (this.props.exportType === ExportButton.DICOMDIR) {

      apis.exportDicom.exportDicomDirDicoms(this.props.orthancIds)

    }

  }

}

ExportButton.HIRACHICAL = 0
ExportButton.DICOMDIR = 1
