import React from 'react'
import { useDispatch } from 'react-redux'

import Papa from 'papaparse'

import MyDropzone from '../../CommonComponents/MyDropzone'
import { addQueryToList } from '../../../actions/TableQuery'

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

    const completeFn = (result) => {
        let csvData = result.data;

        csvData.forEach((query) => {           
            let queryForList = {
                PatientName: query['Patient Name'],
                PatientID: query['Patient ID'],
                AccessionNumber: query['Accession Number'],
                DateFrom: query['Date From'],
                DateTo: query['Date To'],
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
