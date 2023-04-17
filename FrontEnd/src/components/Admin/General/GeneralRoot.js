import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import OrthancSettings from './OrthancSettings/OrthancSettings'
import RedisSettings from './Redis/RedisSettings'

export default () => {

  const ORTHANC_SETTINGS = 'orthancSettings'
  const REDIS_SETTINGS = 'redisSettings'

  const [selectedOptionMenu, setSelectedOptionMenu] = useState(ORTHANC_SETTINGS)

  const switchTab = (optionName) => {
    setSelectedOptionMenu(optionName)
  }

  const getComponentToDisplay = () => {
    switch (selectedOptionMenu) {
      case ORTHANC_SETTINGS:
        return (<OrthancSettings />)
      case REDIS_SETTINGS:
        return (<RedisSettings />)
      default:
        return (null)
    }
  }

  return (
    <>
      <div className='mb-5'>
        <nav className="otjs-navmenu container-fluid">
          <div className="otjs-navmenu-nav">
            <li className='col-6 text-center'>
              <Button
                className={selectedOptionMenu === ORTHANC_SETTINGS ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                onClick={() => switchTab(ORTHANC_SETTINGS)}>
                  Orthanc Settings
              </Button>
            </li>
            <li className='col-6 text-center'>
              <Button
                className={selectedOptionMenu === REDIS_SETTINGS ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                onClick={() => switchTab(REDIS_SETTINGS)}>
                  Redis Settings
              </Button>
            </li>
          </div>
        </nav>
      </div>
      <div>
        {getComponentToDisplay()}
      </div>
    </>
  )
}