import React, { Component } from 'react';
import Papa from 'papaparse'
import moment from 'moment'

import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import { addQueryToList } from '../../../actions/TableQuery'

class CsvLoader extends Component {

    readCsv = (files) => {
        if (files.length === 1) {

            Papa.parse(files[0], {
                header: true,
                skipEmptyLines:true,
                complete: this.completeFn// base config to use for each file
            })
        }
    }

    completeFn = (result, file) => {
        let currentObject = this
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

            currentObject.props.addQueryToList(queryForList)

        })

    }

    render = () => {
        return (
            <Dropzone onDrop={acceptedFiles => this.readCsv(acceptedFiles)} >
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
}

const mapDispatchToProps = {
    addQueryToList
}

export default connect(null, mapDispatchToProps)(CsvLoader)