import React, { useState } from 'react'
import SearchForm from './SearchForm'

const ContentPanel = () => {
    const [selectedOptionMenu, setSelectedOptionMenu] = useState('Search')

    function clickHandler (event) {
      setSelectedOptionMenu(event.target.value)
    }
  
    function getComponentToDisplay () {
      switch (selectedOptionMenu) {
        case 'Search' :
          return (<SearchForm />)
        default :
          return ([])
      }
    }
  
    return (
      <div className='jumbotron row'>
        <div className='col-3'>
          <div className='nav flex-column nav-pills' role='tablist' aria-orientation='vertical'>
            <input className='btn btn-link text-left' type='button' onClick={clickHandler} value='Search' />
          </div>
        </div>
        <div className='col-sm'>
          {getComponentToDisplay()}
        </div>
      </div>
    )


}

export default ContentPanel