import React, { Component } from 'react'
import TableSeries from './TableSeries'
import TableStudy from './TableStudy'

class TableStudiesWithNestedSeries extends Component {

    expandRow = {
        showExpandColumn: true,
        renderer: (row) => {
            //Flatenning the study array for the nested study table
            let series = row.series 
            let answer = []
            for(let serie in series) {
                answer.push( {
                    SeriesOrthancID  : serie,
                    ...series[serie]
                })
            }
    
            return (
                <TableSeries data={answer} parentStudyId={row.StudyOrthancID} onDelete={ this.props.onDeleteSeries } />
            )
        }
                
    }
    
    render(){
        return(
            <TableStudy studies={this.props.studies} expandRow={this.expandRow} onDelete={this.props.onDeleteStudy} {...this.props} />
        )
    }
}

TableStudiesWithNestedSeries.props = {
    onDeleteStudy : function(){},
    onDeleteSeries : function(){}
}

export default TableStudiesWithNestedSeries