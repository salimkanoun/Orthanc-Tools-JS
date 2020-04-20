import React, { Component } from 'react'
import apis from '../../../services/apis'

export default function tableSeriesFillFromParent(TableSeries) {
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

        async componentWillReceiveProps(nextProps){
            if(nextProps.studyID !== ""){
                let seriesAnswer = await apis.content.getSeriesDetails(nextProps.studyID)
                if (seriesAnswer !== undefined){
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
            } else {
                this.setState({
                    series : []
                })
            }
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

    return TableSeriesFillFromParent
}