import React, { useState } from 'react'
import AetRootPanel from './AET/AetRootPanel'
import AutoRetrieveRootPanel from './Robots/AutoRetrieveRootPanel'
import PeerRootPanel from './Peers/PeerRootPanel'
import JobsRootPanel from './Jobs/JobsRootPanel'
import Plugins from './Plugins'
import UserManagement from './UserManagement/UserManagement'
import BurnerOptions from './CDBurner/BurnerOptions'
import EndpointsRootPanel from './Endpoints/EndpointsRootPanel'
import GeneralRoot from './General/GeneralRoot'

/**
 * Root Panel of Admin route
 * Using React Hooks
 */
const AdminPanel = () => {
  const [selectedOptionMenu, setSelectedOptionMenu] = useState('General')

  function clickHandler (event) {
    setSelectedOptionMenu(event.target.value)
  }

  function getComponentToDisplay () {
    switch (selectedOptionMenu) {
      case 'General' :
        return (<GeneralRoot />)
      case 'Aets' :
        return (<AetRootPanel />)
      case 'Peers' :
        return (<PeerRootPanel />)
      case 'External Endpoints' :
        return (<EndpointsRootPanel />)
      case 'Robots' :
        return (<AutoRetrieveRootPanel />)
      case 'Jobs' :
        return (<JobsRootPanel />)
      case 'CD Burner' :
          return (<BurnerOptions />)
      case 'Orthanc Plugins' :
        return (<Plugins />)
      case 'User Management' :
        return (<UserManagement />)
      default :
        return ([])
    }
  }

  return (
    <div className='jumbotron'>
      <div className= "row">
        <div className='col-3'>
          <div className='nav flex-column nav-pills' role='tablist' aria-orientation='vertical'>
            <input className='btn btn-link text-left' type='button' onClick={clickHandler} value='General' />
            <input className='btn btn-link text-left' type='button' onClick={clickHandler} value='Aets' />
            <input className='btn btn-link text-left' type='button' onClick={clickHandler} value='Peers' />
            <input className='btn btn-link text-left' type='button' onClick={clickHandler} value='External Endpoints' />
            <input className='btn btn-link text-left' type='button' onClick={clickHandler} value='Robots' />
            <input className='btn btn-link text-left' type='button' onClick={clickHandler} value='Jobs' />
            <input className='btn btn-link text-left' type='button' onClick={clickHandler} value='CD Burner' />
            <input className='btn btn-link text-left' type='button' onClick={clickHandler} value='Orthanc Plugins' />
            <input className='btn btn-link text-left' type='button' onClick={clickHandler} value='User Management' />
          </div>
        </div>
        <div className='col-sm'>
          {getComponentToDisplay()}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
