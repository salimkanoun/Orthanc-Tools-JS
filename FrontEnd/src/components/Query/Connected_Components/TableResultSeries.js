import React, { Component } from 'react';
import { connect } from 'react-redux'

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import { addManualQuerySeriesDetails } from '../../../actions/ManualQuery'

import apis from '../../../services/apis'
import RetrieveButton from '../Components/RetrieveButton';
import { toast } from 'react-toastify';


class TableResultSeries extends Component {

    columns = [{
        dataField: 'key',
        hidden: true
    }, {
        dataField: 'Level',
        hidden: true
    }, {
        dataField: 'AnswerId',
        hidden: true
    }, {
        dataField: 'AnswerNumber',
        hidden: true
    }, {
        dataField: 'StudyInstanceUID',
        hidden: true
    }, {
        dataField: 'SeriesInstanceUID',
        hidden: true
    }, {
        dataField: 'SeriesDescription',
        text: 'Serie Description',
        sort: true,
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    }, {
        dataField: 'Modality',
        text: 'Modality',
        sort: true
    }, {
        dataField: 'SeriesNumber',
        text: 'Serie Number',
        sort: true
    }, {
        dataField: 'NumberOfSeriesRelatedInstances',
        text: 'Instances'
    }, {
        dataField: 'Retrieve',
        text: 'Retrieve',
        formatter: (cell, row, rowIndex) => {
            return (<RetrieveButton queryAet={row.OriginAET} seriesInstanceUID={row.SeriesInstanceUID} studyInstanceUID={row.StudyInstanceUID} level={RetrieveButton.Series} />)
        }
    }];

    componentDidMount = async () => {
        await this.fetchDataIfUnknown(this.props.rowData.StudyInstanceUID, this.props.rowData.OriginAET)
    }

    fetchDataIfUnknown = async (StudyInstanceUID, OriginAET) => {

        var result = this.props.results.filter(study => {
            return study.StudyInstanceUID === StudyInstanceUID
        })

        if (result[0]['seriesDetails'].length === 0) {
            await this.getSeriesDetails(StudyInstanceUID, OriginAET)
        }
    }

    getSeriesDetails = async (studyUID, aet) => {

        let queryData = {
            Level: 'Series',
            Query: {
                Modality: '',
                ProtocolName: '',
                SeriesDescription: '',
                SeriesInstanceUID: '',
                StudyInstanceUID: studyUID,
                SeriesNumber: '',
                NumberOfSeriesRelatedInstances: ''
            },
            Normalize: false
        }

        try {
            let queryAnswers = await apis.query.dicomQuery(aet, queryData)
            let seriesAnswers = await apis.query.retrieveAnswer(queryAnswers.ID)
            this.props.addManualQuerySeriesDetails(seriesAnswers, studyUID)
        } catch {
            toast.error('Dicom Failure')
        }

    }

    getCurrentStudySeries = () => {

        let currentStudy = this.props.results.filter((studyData) => {
            if (studyData.StudyInstanceUID === this.props.rowData.StudyInstanceUID) {
                return true
            }
            return false
        })

        return currentStudy[0]['seriesDetails']

    }

    render = () => {

        return (
            <ToolkitProvider
                keyField="key"
                data={this.getCurrentStudySeries()}
                columns={this.columns}
            >{
                    props => (
                        <React.Fragment>
                            <BootstrapTable ref={n => this.node = n} {...props.baseProps} striped={true} bordered={false} />
                        </React.Fragment>
                    )
                }
            </ToolkitProvider>
        )
    }



}

const mapStateToProps = (state) => {
    return {
        results: state.ManualQuery.manualQueryResults
    }
}

const mapDispatchToProps = {
    addManualQuerySeriesDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(TableResultSeries)