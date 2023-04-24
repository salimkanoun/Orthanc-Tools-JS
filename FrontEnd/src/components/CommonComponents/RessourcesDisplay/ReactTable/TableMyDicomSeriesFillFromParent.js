import React, { Component, useState } from 'react'
import apis from '../../../../services/apis'
import ConstantLevel from '../../../Modify/ConstantLevel'
import ActionBouton from '../ActionBouton'
import CommonTable from './CommonTable'

export default ({ studyID, columns }) => {

  const [series, setSeries] = useState([]);

  const componentDidUpdate = (prevProps) => {
    if (studyID !== prevProps.studyID) {
      if (studyID == null && series !== []) {
        setSeries([])
      } else {
        loadSeriesInState(studyID)
      }
    }
  }

  const loadSeriesInState = async (studyID) => {
    let seriesAnswer = await apis.content.getSeriesDetailsOfStudy(studyID)
    let seriesData = []
    if (seriesAnswer !== undefined) {
      for (var i = 0; i < seriesAnswer.length; i++) {
        let row = {
          StudyOrthancID: seriesAnswer[i].ParentStudy,
          SerieID: seriesAnswer[i].ID,
          SeriesDescription: seriesAnswer[i].MainDicomTags.SeriesDescription,
          Modality: seriesAnswer[i].MainDicomTags.Modality,
          Instances: seriesAnswer[i].Instances.length,
          SeriesNumber: seriesAnswer[i].MainDicomTags.SeriesNumber,
        }
        seriesData.push(row)
      }
    }
    setSeries(seriesData)
  }

  columns =
    [{
      accessor: 'StudyOrthancID',
      hidden: true,
    },
    {
      accessor: 'SerieID',
      hidden: true
    },
    {
      Header: 'Series Description',
      accessor: 'SeriesDescription',
    },
    {
      Header: 'Modality',
      accessor: 'Modality'
    },
    {
      Header: 'Instances',
      accessor: 'Instances'
    },
    {
      Header: 'Series Number',
      accessor: 'SeriesNumber',
    },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: (row) => {
        return (
          <span>
            <ActionBouton level={ConstantLevel.SERIES}
              orthancID={row.row.values.SerieID}
              dataDetails={row.original}
              hiddenModify={true}
              hiddenDelete={true}
              hiddenMetadata={false}
              hiddenCreateDicom={true} />
          </span>
        )
      }
    }]

  return (
    <CommonTable data={series} columns={columns} />
  )

}