import React from 'react'

export default ({aetName, clickListner}) => {
    return (
      <input type='button' className='btn btn-info btn-large mt-3 mr-3' value={aetName} onClick={clickListner} />
    )
}
