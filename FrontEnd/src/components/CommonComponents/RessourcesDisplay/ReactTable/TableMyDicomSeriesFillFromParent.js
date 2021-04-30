import React, { Component } from 'react'
import apis from '../../../../services/apis'
import TableMyDicomSeries from './TableMyDicomSeries'

export default class TableSeriesFillFromParent extends Component {

    state = {
        series: []
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.studyID !== prevProps.studyID) {
            if (this.props.studyID == null && this.state.series!==[]) {
                this.setState({
                    series: []
                })
            } else {
                this.loadSeriesInState(this.props.studyID)
            }
        }
    }

    loadSeriesInState = async (studyID) => {
        /*
        let seriesAnswer = await apis.content.getSeriesDetails(studyID)
        let seriesData = []
        seriesAnswer.forEach((serie) => {
            seriesData.push({
                StudyID: studyID,
                SeriesOrthancID: serie.ID,
                Instances: serie.Instances.length,
                ...serie.MainDicomTags
            })

        })*/
        if(this.props.studyID=='testStudyOrthancID0'){
            let seriesData = [{
                StudyOrthancID:'StudyOrthancIDTest0',
                SeriesDescription:'SeriesDescriptionTest0',
                Modality:'ModalityTest0',
                Instances:'InstancesTest0',
                SeriesNumber:'SeriesNumberTest0',
                AccessionNumber:'AccessionNumberTest0',
            }]
            this.setState({
                series: seriesData
            })
        }
        if(this.props.studyID=='testStudyOrthancID1'){
            let seriesData = [{
                StudyOrthancID:'StudyOrthancIDTest1',
                SeriesDescription:'SeriesDescriptionTest1',
                Modality:'ModalityTest1',
                Instances:'InstancesTest1',
                SeriesNumber:'SeriesNumberTest1',
                AccessionNumber:'AccessionNumberTest1',
            }]
            this.setState({
                series: seriesData
            })
        }


    }

    render = () => {
        return (
            <TableMyDicomSeries tableData={this.state.series} />
        )
    }
}