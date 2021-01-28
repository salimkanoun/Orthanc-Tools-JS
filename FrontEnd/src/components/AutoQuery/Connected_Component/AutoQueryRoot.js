import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import TableQuery from './TableQuery'
import Results from './Results'
import RobotView from './RobotView'

/**
 * Root Panel of AutoQuery module
 * Using Hooks
 */
const AutoQueryRoot = () => {

  const Query = 'Query'
  const Result = 'Result'
  const MyRobot = 'MyRobot'

  const [currentMainTab, setCurrentMainTab] = useState('Query')
  const username = useSelector(state => state.OrthancTools.username)


  function getComponentToDisplay() {
    let component = null
    switch (currentMainTab) {
      case Query:
        component = <TableQuery switchTab={switchTab} />
        break
      case Result:
        component = <Results switchTab={switchTab} />
        break
      case MyRobot:
        component = <RobotView username={username} />
        break
      default:
        break
    }

    return component
  }

  function switchTab(tabName) {
    setCurrentMainTab(tabName)
  }

  return (
    <div>
      <div className='mb-5'>
        <ul className='nav nav-pills nav-fill'>
          <li className='nav-item'>
            <button className={currentMainTab === 'Query' ? 'col nav-link active link-button' : ' col nav-link link-button'} onClick={() => setCurrentMainTab('Query')}>Query List</button>
          </li>
          <li className='nav-item'>
            <button className={currentMainTab === 'Result' ? 'col nav-link active link-button' : 'col nav-link link-button'} onClick={() => setCurrentMainTab('Result')}>Results</button>
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

export default AutoQueryRoot