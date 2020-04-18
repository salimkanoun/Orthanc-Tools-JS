import React, { Component } from 'react'
import apis from '../../services/apis'

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
                return serie.serieOrthancID !== idDeleted
            })

            this.setState({
                series : newSeriesRows
            })

        }

        async componentWillReceiveProps(){
            if(this.props.studyID !== ""){
                let seriesAnswer = await apis.content.getSeriesDetails(this.props.studyID)
                if (seriesAnswer !== undefined){
                    let seriesData = []
                    seriesAnswer.forEach( (serie) => {
                        seriesData.push({
                            serieOrthancID : serie.ID,
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

    return TableSeriesFillFromParent
}