import React, { useState } from 'react'
import Import from './Import'
import CreateDicom from './CreateDicom'
/**
 * Root Panel of Admin route
 * Using React Hooks
 */

const ImportRootPanel = () => {

  const [selectedOptionMenu, setSelectedOptionMenu] = useState('ImportDicom')

  function clickHandler(event) {
    console.log(event)
    setSelectedOptionMenu(event.target.value)
  }

  function getComponentToDisplay() {
    switch (selectedOptionMenu) {
      case 'ImportDicom':
        return (<Import />)
      case 'CreateDicom':
        return (<CreateDicom />)
      default:
        return ([])
    }
  }

  return (
    <div>
      <div className='mb-5'>
        <ul className='nav nav-pills nav-fill'>
          <li className='nav-item'>
            <button className={selectedOptionMenu === 'ImportDicom' ? 'col nav-link active link-button' : ' col nav-link link-button'} value={'ImportDicom'} onClick={clickHandler}>Import Dicom</button>
          </li>
          <li className='nav-item'>
            <button className={selectedOptionMenu === 'CreateDicom' ? 'col nav-link active link-button' : 'col nav-link link-button'} value={'CreateDicom'} onClick={clickHandler}>Create Dicom</button>
          </li>
        </ul>
      </div>
      <div>
        {getComponentToDisplay()}
      </div>
    </div>
  )
}

export default ImportRootPanel