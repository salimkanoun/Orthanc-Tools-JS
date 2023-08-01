import React from 'react'

import Papa from 'papaparse'

import MyDropzone from '../../CommonComponents/MyDropzone'

export default ({onLoad}) => {

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

        let data = csvData.map((query) => {           
            return {
                PatientName: query['Patient Name'],
                PatientID: query['Patient ID'],
                AccessionNumber: query['Accession Number'],
                DateFrom: query['Date From'],
                DateTo: query['Date To'],
                StudyDescription: query['Study Description'],
                ModalitiesInStudy: query['Modalities'],
                Aet: query['AET'], 
                StudyInstanceUID : query['Study Instance UID'],
                SeriesInstanceUID : query['Series Instance UID']
            }
            
        })
        onLoad(data)

    }

    return (
        <MyDropzone
            onDrop={acceptedFiles => readCsv(acceptedFiles)}
            message={"Drop CSV File"}
            acceptedFiles={['csv']}
        />
    )

}
