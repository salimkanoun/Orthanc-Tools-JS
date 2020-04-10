import React from 'react'
import SearchForm from './SearchForm'



const ContentPanel = () => {
  
    return (
      <div className='jumbotron row'>
        <div className='col-sm'>
          {<SearchForm />}
        </div>
      </div>
    )


}

export default ContentPanel