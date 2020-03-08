import React, { useState } from 'react'

import TableQuery from '../Connected_Component/TableQuery'
import TableResult from '../Connected_Component/TableResult'

/**
 * Test de React Hooks (nouvelle syntaxe sans classe)
 */
function AutoQuery() {

  const [currentMainTab, setCurrentMainTab] = useState('Query')

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
        <TableQuery style={currentMainTab === 'Query' ? {} : { display: 'none' }} />
        <TableResult style={currentMainTab === 'Results' ? {} : { display: 'none' }} />
      </>
    )

}

export default AutoQuery
