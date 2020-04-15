import React, { Fragment } from 'react'
import SearchForm from './SearchForm'

const ContentPanel = () => {
  
    return (
      <Fragment>
        <div className='jumbotron'>
          <div className='col-sm'>
            <SearchForm />
          </div>
        </div>
      </Fragment>
    )

}

export default ContentPanel