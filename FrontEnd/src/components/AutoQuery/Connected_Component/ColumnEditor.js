import React, { Component } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { editColumnQuery } from '../../../actions/TableQuery'
/**
 * Column editor component, for global modification of column
 * (editor component of the table header modifier)
 */
export default ({columnName }) => {

  const dispatch = useDispatch()

  const store = useSelector(state => {
    return {
      queries: state.QueryList
    }
  })

  /**
   * Use Redux to modify all items proprieties
   * @param {*} event 
   */
  const editAllRow = (event) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    dispatch.editColumnQuery(columnName, value)
  }

    return (
      <input type='text' placeholder='Modify' onKeyUp={editAllRow} className='form-control btn-warning' />
    )
}
