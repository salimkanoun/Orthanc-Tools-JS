import React, { Fragment, useState, useSelector } from 'react';
import { Col, Row } from 'react-bootstrap';

import TableResultsStudiesSeries from './TableResultsStudiesSeries'
import TableResultStudy from './TableResultStudy'
import CreateRobot from './CreateRobot'

export default ({ switchTab, setTaskId }) => {

    const [seriesView, setSeriesView] = useState(false)

    const store = useSelector(state => {
        return {
            results: state.AutoRetrieveResultList.results,
            resultsSeries: state.AutoRetrieveResultList.resultsSeries,
            studiesFiltered: state.AutoRetrieveResultList.resultsStudiesFiltered,
            seriesFiltered: state.AutoRetrieveResultList.resultsSeriesFiltered,
        }
    })

    const filterSeriesListener = () => {
        setSeriesView(!seriesView)
    }

    const buildArrayRetrieve = () => {

        let retrieveArray = []

        //If series details have been loaded robot will be defined at series level
        if (Object.keys(store.resultsSeries).length > 0) {
            let seriesUIDArray = []
            //If exist filtered item send them, if no filtered item all series items are sent
            if (store.seriesFiltered.length > 0) {
                seriesUIDArray = store.seriesFiltered
            } else {
                seriesUIDArray = Object.keys(store.resultsSeries)
            }
            for (let seriesUID of seriesUIDArray) {
                let seriesObject = store.resultsSeries[seriesUID]
                retrieveArray.push({
                    ...store.results[seriesObject['StudyInstanceUID']],
                    ...seriesObject
                })
            }
            //Else only use the study results
        } else {

            let studiesUIDArray = []
            if (store.studiesFiltered.length > 0) {
                studiesUIDArray = store.studiesFiltered
            } else {
                studiesUIDArray = Object.keys(store.results)
            }

            for (let studyInstanceUID of studiesUIDArray) {
                retrieveArray.push({ ...store.results[studyInstanceUID] })
            }
        }

        return retrieveArray

    }

    return (
        <Fragment>
            <Row className="mt-3 text-center border-bottom border-2 pb-3">
                <Col>
                    <input type="button" className="otjs-button otjs-button-blue w-12"
                        value={seriesView === true ? "Filter Studies" : "Filter Series"}
                        onClick={filterSeriesListener} />
                </Col>
            </Row>
            <Row className="mt-5">
                {seriesView === true ? <TableResultsStudiesSeries /> : <TableResultStudy />}
            </Row>
            <Row className="mt-5">
                <CreateRobot getResultArray={buildArrayRetrieve} switchTab={switchTab}
                    setTaskId={setTaskId} />
            </Row>
        </Fragment>
    )
}