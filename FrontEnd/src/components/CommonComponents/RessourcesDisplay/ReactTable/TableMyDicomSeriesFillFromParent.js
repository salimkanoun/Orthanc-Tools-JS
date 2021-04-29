import React, { Component } from 'react'
import apis from '../../../../services/apis'
import TableMyDicomSeries from './TableMyDicomSeries'

export default class TableSeriesFillFromParent extends Component {

    state = {
        series: []
    }
    
    componentDidUpdate = (prevProps) => {
        if (this.props.studyID !== prevProps.studyID) {
            if (this.props.studyID === "") {
                this.setState({
                    series: []
                })
            } else {
                this.loadSeriesInState(this.props.studyID)
            }
        }
    }

    loadSeriesInState = async (studyID) => {
        let seriesAnswer = await apis.content.getSeriesDetails(studyID)
        let seriesData = []
        seriesAnswer.forEach((serie) => {
            seriesData.push({
                StudyID: studyID,
                SeriesOrthancID: serie.ID,
                Instances: serie.Instances.length,
                ...serie.MainDicomTags
            })

        })
        this.setState({
            series: seriesData
        })

    }

    render = () => {
        return (
            <TableMyDicomSeries tableData={this.state.series} />
        )
    }
}