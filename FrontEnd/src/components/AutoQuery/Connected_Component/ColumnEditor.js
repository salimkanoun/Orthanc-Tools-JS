import React, { Component } from 'react'
import { connect } from 'react-redux'
import { editColumnQuery } from '../../../actions/TableQuery'
/**
 * Column editor component, for global modification of column
 * (editor component of the table header modifier)
 */
class ColumnEditor extends Component {

  /**
   * Use Redux to modify all items proprieties
   * @param {*} event 
   */
  editAllRow = (event) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    this.props.editColumnQuery(this.props.columnName, value)
  }

  render = () => {
    return (
      <input type='text' placeholder='Modify' onKeyUp={this.editAllRow} className='form-control btn-warning' />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    queries: state.QueryList
  }
}

const mapDispatchToProps = {
  editColumnQuery
}

export default connect(mapStateToProps, mapDispatchToProps)(ColumnEditor)
