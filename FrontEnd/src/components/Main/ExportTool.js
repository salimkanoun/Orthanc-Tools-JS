import React, { Component, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Popover, Col, Row, Overlay } from 'react-bootstrap'

import apis from '../../services/apis'
import SendAetDropdown from "../Export/SendAetDropdown"
import DownloadDropdown from "../Export/DownloadDropdown"
import { emptyExportList, removeSeriesFromExportList, removeStudyFromExportList } from '../../actions/ExportList'
import { toast } from 'react-toastify'
import TableStudyWithNestedSeries from '../CommonComponents/RessourcesDisplay/ReactTable/TableStudiesWithNestedSeries'
import TableStudiesWithNestedSeries from '../CommonComponents/RessourcesDisplay/ReactTable/TableStudiesWithNestedSeries'

export default ({target, show, onHide}) =>{
 
    const [aets, setAets] = useState([])

    const store = useSelector(state => {
        return {
            seriesArray: state.ExportList.seriesArray,
            studyArray: state.ExportList.studyArray
        }
    })

    const dispatch = useDispatch()

    const componentDidMount = async () => {
        try {
            let aets = await apis.aets.getAets()
            this.setAets(aets)
        } catch (error) {
            this.setAets([])
            toast.error(error.statusText)
        }

    }

    const handleClickEmpty = () => {
        dispatch(emptyExportList())
    }

    const onRemoveSeries = (serieID) => {
        dispatch(removeSeriesFromExportList(serieID))
    }

    const onRemoveStudy = (studyID) => {
        dispatch(removeStudyFromExportList(studyID))
    }

    const getExportIDArray = () => {
        let ids = []
        store.seriesArray.forEach(serie => {
            ids.push(serie.SeriesOrthancID)
        })
        return ids
    }

    let idArray = getExportIDArray()
    return (
        <Overlay target={target} show={show} placement='bottom' onHide={onHide}
            rootClose style={{ width: '33%' }}>
            <Popover id='popover-export' style={{ maxWidth: '100%' }}>
                <Popover.Header as='h3'>Export List</Popover.Header>
                <Popover.Body>
                    <div className="row mb-3">
                        <div className="col float-right">
                            <button type="button" className="btn otjs-button otjs-button-orange p-2"
                                onClick={handleClickEmpty}>Empty List
                            </button>
                        </div>
                    </div>
                    <TableStudiesWithNestedSeries
                        series={store.seriesArray}
                        studies={store.studyArray}
                        removeRow={true}
                        accessionNumber={false}
                        actionButton={false}
                        withPatientColums={true}
                        onRemoveStudy={onRemoveStudy}
                        onRemoveSeries={onRemoveSeries}
                        pagination={true}
                        wrapperClasses="table-responsive" />
                    <Row className="text-center mt-5">
                        <Col sm={6}>
                            <DownloadDropdown exportIds={idArray} />
                        </Col>
                        <Col sm={6}>
                            <SendAetDropdown aets={aets} exportIds={idArray} />
                        </Col>
                    </Row>
                </Popover.Body>
            </Popover>
        </Overlay>
    )

}