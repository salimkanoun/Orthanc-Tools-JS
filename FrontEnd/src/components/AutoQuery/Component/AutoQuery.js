import React, { Component } from 'react'

import TableQuery from '../Connected_Component/TableQuery'
import TableResult from '../Connected_Component/TableResult'

class AutoQuery extends Component {

  state = {
    currentMainTab : 'Query'
  }
  
  activate (divName) {
    this.setState({
      currentMainTab : divName
    })
  }

  render () {
    return (
      <>
        <div id='navBar' className='mb-5'>
          <ul className='nav nav-pills nav-fill'>
            <li className='nav-item'>
              <button className={this.state.currentMainTab === 'Query' ? 'col nav-link active link-button' : ' col nav-link link-button'} onClick={() => this.activate('Query')}>Auto Query</button>
            </li>
            <li className='nav-item'>
              <button className={this.state.currentMainTab === 'Results' ? 'col nav-link active link-button' : 'col nav-link link-button'} onClick={() => this.activate('Results')}>Result answers</button>
            </li>
          </ul>
        </div>
        <TableQuery style={this.state.currentMainTab === 'Query' ? {} : { display: 'none' }} />
        <TableResult style={this.state.currentMainTab === 'Results' ? {} : { display: 'none' }} />
      </>
    )
  }
}


export default AutoQuery
