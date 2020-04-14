import React, { Fragment } from 'react'
import SearchForm from './SearchForm'
import TablePatients from './TablePatients'



const ContentPanel = () => {
  
    return (
      <Fragment>
        <div className='jumbotron row'>
          <div className='col-sm'>
            {<SearchForm />}
          </div>
        </div>
        

      </Fragment>
    )


}

export default ContentPanel