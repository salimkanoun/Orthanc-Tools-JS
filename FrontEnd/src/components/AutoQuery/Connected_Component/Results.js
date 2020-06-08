import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'

import TableResultsStudiesSeries from './TableResultsStudiesSeries'
import TableResultStudy from './TableResultStudy'

import CreateRobot from '../Component/CreateRobot'


class Results extends Component {

    state = {
        seriesView: false
    }

    constructor(props) {
        super(props)
        this.filterSeriesListener = this.filterSeriesListener.bind(this)
        this.buildArrayRetrieve = this.buildArrayRetrieve.bind(this)
    }

    filterSeriesListener() {
        this.setState(state => {
            return { seriesView: !state.seriesView }
        })
    }

    buildArrayRetrieve() {

        let retrieveArray = []
        
        //If series details have been loaded robot will be defined at series level
        if (this.props.seriesFiltered.length > 0) {
            for (let seriesUID of this.props.seriesFiltered) {
                let seriesObject = this.props.resultsSeries[seriesUID]
                retrieveArray.push({
                    ...this.props.results[seriesObject['StudyInstanceUID']],
                    ...seriesObject
                })
            }
            //Else only use the study results
        } else {
            for (let studyInstanceUID of this.props.studiesFiltered) {
                retrieveArray.push({ ...this.props.results[studyInstanceUID] })
            }
        }

        return retrieveArray

    }

    render() {
        return (
            <Fragment>
                <div >
                    <input type="button" className="btn btn-info float-right" value={this.state.seriesView === true ? "Filter Studies" : "Filter Series"} onClick={this.filterSeriesListener} />
                </div>
                <div >
                    {this.state.seriesView === true ? <TableResultsStudiesSeries /> : <TableResultStudy />}
                </div>
                <div className="text-center">
                    <CreateRobot getResultArray={this.buildArrayRetrieve} switchTab={this.props.switchTab} />
                </div>
            </Fragment>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        results: state.AutoRetrieveResultList.results,
        resultsSeries: state.AutoRetrieveResultList.resultsSeries,
        studiesFiltered: state.AutoRetrieveResultList.resultsStudiesFiltered,
        seriesFiltered: state.AutoRetrieveResultList.resultsSeriesFiltered,
    }
}

export default connect(mapStateToProps, null)(Results);