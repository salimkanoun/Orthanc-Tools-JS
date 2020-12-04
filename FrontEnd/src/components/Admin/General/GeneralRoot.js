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
      case 'orthancSettings' :
        return (<OrthancSettings />)
      case 'redisSettings' :
        return (<RedisSettings/>)
      default :
        return (null)
    }
  }

  return (
    <div>
        <div className='mb-5'>
            <ul className='nav nav-pills nav-fill'>
            <li className='nav-item'>
                <button className={selectedOptionMenu === 'orthancSettings' ? 'col nav-link active link-button' : 'col link-button'} onClick={() => switchTab('orthancSettings')}>Orthanc Settings</button>
            </li>    
            <li className='nav-item'>
                <button className={selectedOptionMenu === 'redisSettings' ? 'col nav-link active link-button' : ' col link-button'} onClick={() => switchTab('redisSettings')}>Redis Settings</button>
            </li>
            </ul>
        </div>
        <div>
            {getComponentToDisplay()}
        </div>
    </div>
  )

}

export default GeneralRoot
