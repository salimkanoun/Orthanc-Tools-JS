import React, { Component } from 'react'

export default class CreateRobot extends Component {
  constructor (props) {
    super(props)
    this.createRobot = this.createRobot.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      projectName: ''
    }
  }

  async createRobot () {
    // SK ICI TRAITER QUE LES RESULTS SELECTIONNES ?
    // Serait a gerer dans le state ?
    const results = this.props.resultArray

    console.log(results)

    const retrieveArray = []

    results.forEach(result => {
      const resultToRobot = {
        patientName: result.patientName,
        patientID: result.patientID,
        studyDate: result.studyDate,
        modality: result.modalitiesInStudy,
        studyDescription: result.studyDescription,
        accessionNb: result.accessionNumber,
        aet: result.originAET
      }

      retrieveArray.push(resultToRobot)
    })

    const createAnswer = await fetch('/api/robot',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectName: this.state.projectName, studyArray: retrieveArray })
      }).then((answer) => {
      return (answer.json())
    })

    console.log(createAnswer)
  }

  handleChange (event) {
    const target = event.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value

    const newState = {
      ...this.state
    }
    newState[name] = value

    this.setState(newState)
  }

  render () {
    return (
      <div className='container'>
        <div className='row float-right'>
                Project Name :
          <input type='text' className='' name='projectName' value={this.state.value} onChange={this.handleChange} />
          <input type='button' className='btn btn-success' onClick={this.createRobot} value='Create Robot' />
        </div>
      </div>
    )
  }
}
