import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as actions from '../actions/TableResult'

class ExportButton extends Component {

    constructor(props) {
        super(props)
    }

    clickListner() {

    }

    render() {
        return (<div className="col-sm">
            <input type="button" className="btn btn-info btn-large" onClick={this.doRetrieve} disabled={this.props.rowData.isRetrieved ? false : true } value="Export" />
        </div>)
    }

    async doExport() {

    }

}

const mapStateToProps = (state) => {
    return {
      results : state.resultList
    }
  }
  
  
export default connect(mapStateToProps, actions)(ExportButton);
