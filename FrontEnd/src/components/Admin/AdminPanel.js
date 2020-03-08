import React, { useState } from 'react'
import OrthancSettings from './OrthancSettings'
import AetPanel from './AetPanel'
import AutoRetrieveOptions from './AutoRetrieveOptions'

/**
 * Using React Hooks
 */
const AdminPanel = () => {

  const [selectedOptionMenu, setSelectedOptionMenu] = useState('General');

  function clickHandler(event){
    setSelectedOptionMenu(event.target.value)
  }

  function getComponentToDisplay(){
    switch (selectedOptionMenu){
      case 'General' : 
        return (<OrthancSettings/>)
      case 'Aets' : 
        return (<AetPanel />)
      case 'Robots' : 
        return (<AutoRetrieveOptions />)
      default : 
        return ([])
    }
  }

  return (
    <div className='jumbotron row'>
      <div className="col-3">
          <div className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
            <input className="btn btn-link text-left" type="button" onClick={clickHandler} value="General" />
            <input className="btn btn-link text-left" type="button" onClick={clickHandler} value="Aets" />
            <input className="btn btn-link text-left" type="button" onClick={clickHandler} value="Robots" />
          </div>
      </div>
      <div className="col-sm">
          {getComponentToDisplay()}
      </div>
    </div>
  )
  
}

export default AdminPanel