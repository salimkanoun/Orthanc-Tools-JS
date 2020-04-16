import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ActionBouton from './ActionBouton'
import apis from '../../services/apis'


class TableSeries extends Component{

    state = {
        series :  []
    }

    constructor(props){
        super(props)
        
        this.setState({
            series : this.props.series
        })
        console.log(props.series)
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    async componentDidMount(){
        if(this.state.series.length === 0){
            let serieDetails = await apis.content.getSeriesDetails(this.props.seriesID)
            console.log("serieDetail = ", serieDetails)
            this.setState({series: serieDetails})
        }
    }


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
        formatter: ((value, row, index) => console.log(index))//<ActionBouton level='series' orthancID={this.props.series[index].serieOrthancID} />)
    }]


    render(){
        
        return (
            <BootstrapTable keyField="serieOrthancID" striped={true} data={this.state.series} columns={this.columns} />
        )
        
    }
}

TableSeries.defaultProps = {
    series: [], 
    seriesID: null
}

export default TableSeries