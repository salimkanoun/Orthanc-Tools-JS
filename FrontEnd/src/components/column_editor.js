import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions/TableResult'

class ColumnEditor extends Component {
  constructor (props) {
    super(props)
    this.editAllRow=this.editAllRow.bind(this)
  }

  editAllRow(event){
    event.preventDefault()
    console.log(this.props.columnNumber)
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
