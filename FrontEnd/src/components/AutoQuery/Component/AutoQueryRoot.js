import React, { useState } from 'react'

import TableQuery from '../Connected_Component/TableQuery'
import Results from '../Connected_Component/Results'
import RobotView from '../Connected_Component/RobotView'

/**
 * Root Panel of AutoQuery module
 * Using Hooks
 */
function AutoQueryRoot () {

  const [currentMainTab, setCurrentMainTab] = useState('Query')

  function getComponentToDisplay () {
    let component = null
    switch(currentMainTab) { 
      case AutoQueryRoot.Query:
        component = <TableQuery switchTab={switchTab} />
        break
      case AutoQueryRoot.Results:
        component = <Results switchTab={switchTab} />
        break
      case AutoQueryRoot.MyRobot:
        component = <RobotView username="salim" />
        break
      default : 
        break
    }

    return component
  }

  function switchTab(tabName) {
    setCurrentMainTab(tabName)
  }

  return (
    <div>
      <div id='navBar' className='mb-5'>
        <ul className='nav nav-pills nav-fill'>
          <li className='nav-item'>
            <button className={currentMainTab === 'Query' ? 'col nav-link active link-button' : ' col nav-link link-button'} onClick={() => setCurrentMainTab('Query')}>Query List</button>
          </li>
          <li className='nav-item'>
            <button className={currentMainTab === 'Results' ? 'col nav-link active link-button' : 'col nav-link link-button'} onClick={() => setCurrentMainTab('Results')}>Results</button>
          </li>
          <li className='nav-item'>
            <button className={currentMainTab === 'MyRobot' ? 'col nav-link active link-button' : 'col nav-link link-button'} onClick={() => setCurrentMainTab('MyRobot')}>My Retrieve Robot</button>
          </li>
        </ul>
      </div>
      <div className="jumbotron">
        {getComponentToDisplay()}
      </div>
    </div>
  )
}

AutoQueryRoot.Query = 'Query'
AutoQueryRoot.Results = 'Results'
AutoQueryRoot.MyRobot = 'MyRobot'

export default AutoQueryRoot
