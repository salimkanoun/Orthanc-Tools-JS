import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';


class TableQuery extends Component {


    columns = [{
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
      
    rows=[]

    addRow(name, id, dateFrom, dateTo, studyDescription, modality, aet){
        this.rows.push({
            name : name,
            id : id,
            dateFrom : dateFrom,
            dateTo : dateTo,
            studyDescription : studyDescription,
            modality : modality,
            aet : aet
        })
    }
      
    render(){
        this.addRow('A','b', 'c', 5, 6 ,7)
        this.addRow('A','b', 'c', 5, 6 ,7)
        return(
            <div className="jumbotron" style={this.props.style}>
                <BootstrapTable keyField='id' data={ this.rows } columns={ this.columns } />
            </div>
        )
    }

}

export default TableQuery