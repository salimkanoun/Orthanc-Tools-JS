import React from 'react'
import { useDispatch } from 'react-redux'

import Papa from 'papaparse'
import moment from 'moment'

import MyDropzone from '../CommonComponents/MyDropzone'
import { addQueryToList } from '../../actions/TableQuery'

export default () => {

    const dispatch = useDispatch()

    const readCsv = (files) => {
        if (files.length === 1) {

            Papa.parse(files[0], {
                header: true,
                skipEmptyLines: true,
                complete: completeFn// base config to use for each file
            })
        }
    }

    const completeFn = (result, file) => {
        let csvData = result.data;

        csvData.forEach((query) => {
            let dateFrom, dateTo
            if (query.DateFrom === '') {
                dateFrom = ''
            } else {
                dateFrom = moment(query.DateFrom, 'YYYYMMDD').format("YYYY-MM-DD")
            }

            if (query.DateTo === '') {
                dateTo = ''
            } else {
                dateTo = moment(query.DateTo, 'YYYYMMDD').format("YYYY-MM-DD")
            }
            
            let queryForList = {
                PatientName: query['Patient Name'],
                PatientID: query['Patient ID'],
                AccessionNumber: query['Accession Number'],
                DateFrom: dateFrom,
                DateTo: dateTo,
                StudyDescription: query['Study Description'],
                ModalitiesInStudy: query['Modalities'],
                Aet: query['AET']
            }

            dispatch(addQueryToList(queryForList))

        })

    }

    return (
        <MyDropzone
            onDrop={acceptedFiles => readCsv(acceptedFiles)}
            message={"Drop CSV File"}
            acceptedFiles={['csv']}
        />
    )

}
