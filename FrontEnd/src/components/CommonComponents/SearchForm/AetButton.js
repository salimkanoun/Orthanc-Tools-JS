import React from 'react'
import { Button } from 'react-bootstrap'

export default ({ aetName, onClick }) => {
  return (
    <Button
      variant='info'
      className='mt-3 mr-3'
      onClick={onClick}
    >
      {aetName}
    </Button>
  )
}
