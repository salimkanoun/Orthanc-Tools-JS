import React, { Component } from 'react'
import apis from '../../../../services/apis'
import ActionBouton from '../ActionBouton'
import CommonTable from './CommonTable'

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
        let seriesAnswer = await apis.content.getSeriesDetails(studyID) 
        let seriesData = []
        if(seriesAnswer!==undefined){
          for(var i=0;i<seriesAnswer.length;i++){
            let row={
              StudyOrthancID:seriesAnswer[i].ParentStudy,
              SerieID:seriesAnswer[i].ID,
              SeriesDescription:seriesAnswer[i].MainDicomTags.SeriesDescription,
              Modality:seriesAnswer[i].MainDicomTags.Modality,
              Instances:seriesAnswer[i].Instances.length,
              SeriesNumber:seriesAnswer[i].MainDicomTags.SeriesNumber,
            }
            seriesData.push(row)
          }
        }
        this.setState({series:seriesData})
    }

    columns = 
    [      {
            accessor:'StudyOrthancID',
            hidden : true,
          },
          {
            accessor:'SerieID',
            hidden : true
          },
          {
            Header: 'Series Description',
            accessor: 'SeriesDescription',
          },
          {
            Header :'Modality',
            accessor:'Modality'
          },
          {
            Header:'Instances',
            accessor:'Instances'
          },
          {
            Header: 'Series Number',
            accessor:'SeriesNumber',
          },
          {
            Header: 'Action',
            accessor: 'action',
            Cell:(row)=>{
              return(
              <span>
                <ActionBouton level='series' 
                  orthancID={row.row.values.SerieID} 
                  row={row.row.values} 
                  hiddenModify={true} 
                  hiddenDelete={true} 
                  hiddenMetadata={false} 
                  hiddenCreateDicom={true}/>
              </span>
              )
            }
          }]

    render = () => {
        return (
            <CommonTable tableData={this.state.series} columns={this.columns}/>
        )
    }
}