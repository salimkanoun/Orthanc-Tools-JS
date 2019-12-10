import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import { connect } from 'react-redux'
import * as actions from '../actions/TableQuery'


class TableQuery extends Component {

  constructor(props){
    super(props)

  }

    columns = [{
        dataField: 'number',
        hidden: true
      },{
        dataField: 'name',
        text: 'Patient Name',
        sort: true
      }, {
        dataField: 'id',
        text: 'Patient ID',
        sort: true
      }, {
        dataField: 'dateFrom',
        text: 'Date From',
        sort: true
      }, {
        dataField: 'dateTo',
        text: 'Date To',
        sort: true
      }, {
        dataField: 'studyDescription',
        text: 'Study Description',
        sort: true
      }, {
        dataField: 'modality',
        text: 'Modality',
        sort: true
      }, {
        dataField: 'aet',
        text: 'AET',
        sort: true
      }];
      
    render(){
      console.log(this.props)
        return(
            <div className="jumbotron" style={this.props.style}>
                <BootstrapTable keyField='id' data={ this.props.queries.queries } columns={ this.columns } />
            </div>
        )
    }

}

const mapStateToProps = ( state )=>{
  return {
    queries : state.QueryList
  }
}

export default connect(mapStateToProps, actions)(TableQuery);