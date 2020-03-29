import React, { useState } from 'react'

import TableQuery from '../Connected_Component/TableQuery'
import TableResultStudy from '../Connected_Component/TableResultStudy'

/**
 * Root Panel of AutoQuery module
 * Using Hooks
 */
function AutoQueryRoot () {
  const [currentMainTab, setCurrentMainTab] = useState('Query')

  function getComponentToDisplay () {
    let component = null
    currentMainTab === 'Query' ? component = <TableQuery /> : component = <TableResultStudy />
    return component
  }

  return (
    <>
      <div id='navBar' className='mb-5'>
        <ul className='nav nav-pills nav-fill'>
          <li className='nav-item'>
            <button className={currentMainTab === 'Query' ? 'col nav-link active link-button' : ' col nav-link link-button'} onClick={() => setCurrentMainTab('Query')}>Auto Query</button>
          </li>
          <li className='nav-item'>
            <button className={currentMainTab === 'Results' ? 'col nav-link active link-button' : 'col nav-link link-button'} onClick={() => setCurrentMainTab('Results')}>Result answers</button>
          </li>
        </ul>
      </div>
      <div>
        {getComponentToDisplay()}
      </div>
    </>
  )
}

export default AutoQueryRoot
