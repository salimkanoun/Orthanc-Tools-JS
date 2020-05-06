import React, { Component } from 'react'
import TableSeries from './TableSeries'
import TableStudy from './TableStudy'

class TableStudiesWithNestedSeries extends Component {
    
    static defaultProps = {
        onDeleteStudy : function(){},
        onDeleteSeries : function(){}
    }
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
                <TableSeries {...this.props} data={answer} parentStudyId={row.StudyOrthancID} onDelete={ this.props.onDeleteSeries } />
            )
        }, 
        parentClassName: (isExpanded, row, rowIndex) => {
            if(isExpanded){
                return 'bg-info'
            }else{
                return ''
            }
        }
                
    }
    
    render(){
        return(
            <TableStudy studies={this.props.studies} expandRow={this.expandRow} onDelete={this.props.onDeleteStudy} {...this.props} />
        )
    }
}

export default TableStudiesWithNestedSeries