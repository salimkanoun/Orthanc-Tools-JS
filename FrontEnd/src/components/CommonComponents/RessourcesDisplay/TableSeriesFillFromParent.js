import React, {Component} from 'react'
import apis from '../../../services/apis'
import TableSeries from './ReactTable/TableSeries'

export default class TableSeriesFillFromParent extends Component {

    state = {
        series: []
    }

    static defaultProps = {
        onEmptySeries: function () {
        }
    }

    onDelete = (idDeleted, parentID) => {

        let newSeriesRows = this.state.series.filter((serie) => {
            return serie.SeriesOrthancID !== idDeleted
        })

        this.setState({
            series: newSeriesRows
        })
        if (this.state.series.length === 0) {
            this.props.onEmptySeries()
            this.props.onDeleteStudy(parentID)
        }

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
            <TableSeries series={this.state.series} onDelete={this.onDelete} {...this.props} />
        )
    }
}