import React, { Component } from 'react'
import apis from '../../../services/apis'
import TableSeries from './TableSeries'

class TableSeriesFillFromParent extends Component {

    state = {
        series : []
    }

    constructor(props){
        super(props)
        this.onDelete=this.onDelete.bind(this)
    }

    onDelete(idDeleted){

        let newSeriesRows = this.state.series.filter((serie) =>{
            return serie.SerieOrthancID !== idDeleted
        })

        this.setState({
            series : newSeriesRows
        })
        if(this.state.series.length ===0){
            this.props.onEmptySeries()
        }

    }

    async componentDidUpdate(prevProps){
        if(this.props.studyID !== prevProps.studyID){
            if(this.props.studyID === "") {
                this.setState({
                    series : []
                })
            }else{
                this.loadSeriesInState(this.props.studyID)
            }
        }
    }

    async loadSeriesInState(studyID) {
        let seriesAnswer = await apis.content.getSeriesDetails(studyID)
        let seriesData = []
        seriesAnswer.forEach( (serie) => {
            seriesData.push({
                SerieOrthancID : serie.ID,
                Instances : serie.Instances.length,
                ...serie.MainDicomTags
            })

        })
        this.setState({
            series : seriesData
        })

    }
    
    render(){
        return(
            <TableSeries series={this.state.series} onDelete={this.onDelete} {...this.props} />
        )
    }
}

TableSeriesFillFromParent.props ={
    onEmptySeries : function () {}
}

export default TableSeriesFillFromParent