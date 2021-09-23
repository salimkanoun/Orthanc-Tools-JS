import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux'
import {Col, Row} from 'react-bootstrap';
import TableResultsStudiesSeries from './TableResultsStudiesSeries'
import TableResultStudy from './TableResultStudy'

import CreateRobot from './CreateRobot'

class Results extends Component {

    state = {
        seriesView: false
    }

    filterSeriesListener = () => {
        this.setState(state => {
            return {seriesView: !state.seriesView}
        })
    }

    buildArrayRetrieve = () => {

        let retrieveArray = []

        //If series details have been loaded robot will be defined at series level
        if (Object.keys(this.props.resultsSeries).length > 0) {
            let seriesUIDArray = []
            //If exist filtered item send them, if no filtered item all series items are sent
            if (this.props.seriesFiltered.length > 0) {
                seriesUIDArray = this.props.seriesFiltered
            } else {
                seriesUIDArray = Object.keys(this.props.resultsSeries)
            }
            for (let seriesUID of seriesUIDArray) {
                let seriesObject = this.props.resultsSeries[seriesUID]
                retrieveArray.push({
                    ...this.props.results[seriesObject['StudyInstanceUID']],
                    ...seriesObject
                })
            }
            //Else only use the study results
        } else {

            let studiesUIDArray = []
            if (this.props.studiesFiltered.length > 0) {
                studiesUIDArray = this.props.studiesFiltered
            } else {
                studiesUIDArray = Object.keys(this.props.results)
            }

            for (let studyInstanceUID of studiesUIDArray) {
                retrieveArray.push({...this.props.results[studyInstanceUID]})
            }
        }

        return retrieveArray

    }

    render = () => {
        return (
            <Fragment>
                <Row className="mt-3 text-center border-bottom border-2 pb-3">
                    <Col>
                        <input type="button" className="otjs-button otjs-button-blue w-12"
                               value={this.state.seriesView === true ? "Filter Studies" : "Filter Series"}
                               onClick={this.filterSeriesListener}/>
                    </Col>
                </Row>
                <Row className="mt-5">
                    {this.state.seriesView === true ? <TableResultsStudiesSeries/> : <TableResultStudy/>}
                </Row>
                <Row className="mt-5">
                    <CreateRobot getResultArray={this.buildArrayRetrieve} switchTab={this.props.switchTab}
                                 setTaskId={this.props.setTaskId}/>
                </Row>
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

export default connect(mapStateToProps, null)(Results)