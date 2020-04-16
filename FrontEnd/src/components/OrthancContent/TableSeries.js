import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ActionBouton from './ActionBouton'


class TableSeries extends Component{

    columns = [{
        dataField: 'serieOrthancID', 
        hidden: true,
    }, {
        dataField: 'SeriesDescription', 
        text: 'Description'
    }, {
        dataField: 'Modality', 
        text: 'Modality'
    },{
        dataField: 'Instances', 
        text: 'Instances'
    }, {
        dataField: 'SeriesNumber',
        text: 'Series Number', 
        sort: true
    }, {
        dataField: 'Action', 
        text: 'Action',
        formatter: ((value, row, index) => <ActionBouton level='series' orthancID={this.props.data[index].serieOrthancID} />)
    }]

    componentDidMount(){
        //Appeler API /studies/{id}? GET

    }

    render(){
        return (
            <BootstrapTable keyField="serieOrthancID" striped={true} data={this.props.data} columns={this.columns} />
        )
    }
}

export default TableSeries