import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import TableQuery from './TableQuery'
import Results from './Results'
import RobotView from './RobotView'
import RobotHistoric from './RobotHistoric'

/**
 * Root Panel of AutoQuery module
 * Using Hooks
 */
const AutoQueryRoot = () => {

  const QUERRY = 'Query'
  const RESULT = 'Result'
  const MY_ROBOT = 'MyRobot'
  const HISTORIC = 'Historic'

  const [currentMainTab, setCurrentMainTab] = useState('Query')
  const username = useSelector(state => state.OrthancTools.username)


  function getComponentToDisplay() {
    let component = null
    switch (currentMainTab) {
      case QUERRY:
        component = <TableQuery switchTab={switchTab} />
        break
      case RESULT:
        component = <Results switchTab={switchTab} />
        break
      case MY_ROBOT:
        component = <RobotView username={username} />
        break
      case HISTORIC:
        component = <RobotHistoric username={username} />
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
            <button className={currentMainTab === QUERRY ? 'col nav-link active link-button' : ' col nav-link link-button'} onClick={() => setCurrentMainTab(QUERRY)}>Query List</button>
          </li>
          <li className='nav-item'>
            <button className={currentMainTab === RESULT ? 'col nav-link active link-button' : 'col nav-link link-button'} onClick={() => setCurrentMainTab(RESULT)}>Results</button>
          </li>
          <li className='nav-item'>
            <button className={currentMainTab === MY_ROBOT ? 'col nav-link active link-button' : 'col nav-link link-button'} onClick={() => setCurrentMainTab(MY_ROBOT)}>My Retrieve Robot</button>
          </li>
          <li className='nav-item'>
            <button className={currentMainTab === HISTORIC ? 'col nav-link active link-button' : 'col nav-link link-button'} onClick={() => setCurrentMainTab(HISTORIC)}>Historic</button>
          </li>
        </ul>My Retrieve Robot
      </div>
      <div className="jumbotron">
        {getComponentToDisplay()}
      </div>
    </div>
  )
}

export default AutoQueryRoot