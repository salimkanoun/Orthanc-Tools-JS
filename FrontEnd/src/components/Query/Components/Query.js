import React from 'react'
import QueryForm from '../Connected_Components/QueryForm'
import TableResultStudy from '../Connected_Components/TableResultStudy'
import { Row } from 'react-bootstrap'

export default function Query() {
  return (
    <div>
      <Row>
        <QueryForm />
      </Row>
      <Row>
        <TableResultStudy />
      </Row>
    </div>
  )
} 
