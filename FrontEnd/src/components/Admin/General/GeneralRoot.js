import React, { useState } from 'react'
import OrthancSettings from './OrthancSettings/OrthancSettings'
import RedisSettings from './Redis/RedisSettings'

const GeneralRoot = () => {

  const [selectedOptionMenu, setSelectedOptionMenu] = useState('orthancSettings')

  let switchTab = (optionName) => {
    setSelectedOptionMenu(optionName)
  }

  let getComponentToDisplay = () => {
    switch (selectedOptionMenu) {
      case 'orthancSettings':
        return (<OrthancSettings />)
      case 'redisSettings': 
        return (<RedisSettings />)
      default:
        return (null)
    }
  }

  return ( 
    <div>
      <div className='mb-5'>
        <nav className="otjs-navmenu container-fluid">
          <div className="otjs-navmenu-nav">
            <li className='col-6 text-center'>
              <button
                className={selectedOptionMenu === 'orthancSettings' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                onClick={() => switchTab('orthancSettings')}>Orthanc Settings
              </button> 
            </li>
            <li className='col-6 text-center'>
              <button
                className={selectedOptionMenu === 'redisSettings' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                onClick={() => switchTab('redisSettings')}>Redis Settings
              </button> 
            </li>
          </div>
        </nav>
      </div>
      <div>
        {getComponentToDisplay()}
      </div>
    </div>
  )

}

export default GeneralRoot