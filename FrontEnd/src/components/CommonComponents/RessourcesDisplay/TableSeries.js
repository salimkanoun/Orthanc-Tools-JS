import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ActionBouton from './ActionBouton'


class TableSeries extends Component{

    columns = [{
        dataField: 'SerieOrthancID', 
        hidden: true,
    }, {
        dataField: 'SeriesDescription', 
        text: 'Series Description'
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
        formatter: ((value, row, index) => <ActionBouton level='series' orthancID={row.SerieOrthancID} onDelete={this.props.onDelete} />)
    }]


    render(){
        return (
            <BootstrapTable 
                keyField="SerieOrthancID" 
                striped={true} 
                data={this.props.series} 
                columns={this.columns}
                {...this.props} 
            />
        )
    }
}

TableSeries.props = {
    onDelete : function(id){
        console.log('Deleted Series ID' + id)
    }
}

export default TableSeries