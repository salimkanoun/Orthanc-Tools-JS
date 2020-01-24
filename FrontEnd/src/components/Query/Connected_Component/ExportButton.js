import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../actions/TableResult'

class ExportButton extends Component {
  constructor (props) {
    super(props)
    this.doExport = this.doExport.bind(this)
  }

  render () {
    console.log(this.props.rowData)
    return (<div className='col-sm'>
      <input type='button' className='btn btn-info btn-large' onClick={this.doExport} disabled={!this.props.rowData.isRetrieved} value='Export' />
            </div>)
  }

  async doExport () {
    const currentComponent = this
    const exportAnswer = await fetch('/apis/export_dicom', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ studyUID: currentComponent.props.rowData.studyUID })
    }).then((response) => { return response.json() })
    console.log(exportAnswer)
  }
}

const mapStateToProps = (state) => {
  return {
    results: state.ResultList
  }
}

export default connect(mapStateToProps, actions)(ExportButton)
