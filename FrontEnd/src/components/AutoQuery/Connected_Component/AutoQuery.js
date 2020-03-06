import React, { Component } from 'react'

import TableQuery from './TableQuery'
import TableResult from './TableResult'

import { connect } from 'react-redux'
import * as actions from '../../../actions'

class AutoQuery extends Component {
  activate (divName) {
    this.props.setTab(divName)
  }

  async componentDidMount () {
    const aets = await this.getAets()
    this.props.setAets(aets)
  }

  static async getAets () {
    const aets = await fetch('/api/aets').then((answer) => { return answer.json() })
    const aetsRows= []
    for (const property in aets) {
      aetsRows.push({
          name : property,
          aetName : aets[property].AET,
          ip : aets[property].Host,
          port : aets[property].Port,
          manufacturer : aets[property].Manufacturer
      })

  }
    return aetsRows
  }

  render () {
    return (
      <>
        <div id='navBar' className='mb-5'>
          <ul className='nav nav-pills nav-fill'>
            <li className='nav-item'>
              <button className={this.props.currentMainTab === 'Query' ? 'col nav-link active link-button' : ' col nav-link link-button'} onClick={() => this.activate('Query')}>Auto Query</button>
            </li>
            <li className='nav-item'>
              <button className={this.props.currentMainTab === 'Results' ? 'col nav-link active link-button' : 'col nav-link link-button'} onClick={() => this.activate('Results')}>Result answers</button>
            </li>
          </ul>
        </div>
        <TableQuery style={this.props.currentMainTab === 'Query' ? {} : { display: 'none' }} />
        <TableResult style={this.props.currentMainTab === 'Results' ? {} : { display: 'none' }} />
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentMainTab: state.Query.currentMainTab
  }
}

export default connect(mapStateToProps, actions)(AutoQuery)
