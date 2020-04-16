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
        formatter: ((value, row, index) => <ActionBouton level='series' orthancID={row.serieOrthancID} />)
    }]


    render(){
        
        return (
            <BootstrapTable keyField="serieOrthancID" striped={true} data={this.props.series} columns={this.columns} />
        )
        
    }
}

export default TableSeries