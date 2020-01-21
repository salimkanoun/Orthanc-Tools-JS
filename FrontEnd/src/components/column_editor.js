import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions/TableQuery'

class ColumnEditor extends Component {

  constructor (props) {
    super(props)
    this.editAllRow=this.editAllRow.bind(this)
  }

  editAllRow(event){
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    this.props.editColumnQuery(this.props.columnName, value);
    console.log(this.props.queries)

  }

  render () {
    return ( 
        <input type="text" placeholder="Modify" onKeyUp={this.editAllRow} className="form-control btn-warning"/>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    queries: state.QueryList
  }
}

export default connect(mapStateToProps, actions)(ColumnEditor)
