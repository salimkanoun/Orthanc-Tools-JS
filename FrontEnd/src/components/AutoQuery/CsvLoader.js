import React from 'react'
import { useDispatch } from 'react-redux'

import Dropzone from 'react-dropzone'
import Papa from 'papaparse'
import moment from 'moment'

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
            if (query['Acquisition Date'] === undefined) {

                if (query['Date From'] === '') {
                    dateFrom = ''
                } else {
                    dateFrom = moment(query['Date From'], 'YYYYMMDD').format("YYYY-MM-DD")
                }

                if (query['Date To'] === '') {
                    dateTo = ''
                } else {
                    dateTo = moment(query['Date To'], 'YYYYMMDD').format("YYYY-MM-DD")
                }

            } else {
                //Case CSV comming from result list
                dateFrom = moment(query['Acquisition Date'], 'YYYYMMDD').format("YYYY-MM-DD")
                dateTo = moment(query['Acquisition Date'], 'YYYYMMDD').format("YYYY-MM-DD")

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
        <Dropzone onDrop={acceptedFiles => readCsv(acceptedFiles)} >
            {({ getRootProps, getInputProps }) => (
                <section>
                    <div className={"dropzone"} {...getRootProps()} >
                        <input {...getInputProps()} />
                        <p>{"Drop CSV File"}</p>
                    </div>
                </section>
            )}
        </Dropzone>
    )

}
