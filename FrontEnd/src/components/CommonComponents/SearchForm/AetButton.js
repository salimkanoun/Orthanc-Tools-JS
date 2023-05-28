import React from 'react'
import { Button } from 'react-bootstrap'

export default ({ aetName, onClick }) => {
  return (
    <Button
      variant='info'
      className='m-2'
      onClick={onClick}
    >
      {aetName}
    </Button>
  )
}
