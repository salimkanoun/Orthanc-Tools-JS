import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../actions/TableResult'

class RetrieveButton extends Component {
  constructor(props) {
    super(props)
    this.clickListner = this.clickListner.bind(this)
    this.doRetrieve = this.doRetrieve.bind(this)
    this.state = {
      status: 'Idle'
    }
  }

  clickListner() {
    this.setState({
      status: 'Pending'
    })
  }

  getClassFromStatus() {
    if (this.state.status === 'Idle') return 'btn btn-info btn-large'
    else if (this.state.status === 'Running') return 'btn btn-warning btn-large'
    else if (this.state.status === 'Success') return 'btn btn-success btn-large'
    // SK Checker Error ou Failed dans Orthanc status
    else if (this.state.status === 'Error') return 'btn btn-error btn-large'
  }

  render() {
    const classNameValue = this.getClassFromStatus()
    return (<div className='col-sm'>
      <input type='button' className={classNameValue} onClick={this.doRetrieve} value='Retrieve' />
    </div>)
  }

  async doRetrieve() {
    const rowData = this.props.rowData
    const postData = {
      queryID: rowData.answerId,
      answerNumber: rowData.answerNumber
    }

    const jobUid = await fetch('/api/retrieve',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      }).then((response) => { return response.json() })

    this.monitorJob(jobUid)
  }

  async monitorJob(jobUid) {
    const currentComponent = this
    let intervalChcker

    let getJobData = async function () {

      let jobData = await fetch('/api/job_details', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobUid: jobUid })
      }).then((response) => { return response.json() })

      let currentStatus = jobData.State

      currentComponent.setState({
        status: currentStatus
      })

      console.log(currentStatus) 

      if (currentStatus === 'Success' || currentStatus === 'Failure' ) {
        clearInterval(intervalChcker)
        if (currentStatus === 'Success') {
          currentComponent.props.setRetrieveStatus(currentComponent.props.rowData.key, true)
        }
      }
    }

    intervalChcker = setInterval(getJobData, 2000)
  }
}

const mapStateToProps = (state) => {
  return {
    results: state.resultList
  }
}

export default connect(mapStateToProps, actions)(RetrieveButton)
