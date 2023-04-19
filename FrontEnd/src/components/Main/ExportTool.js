import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Popover, Col, Row, Overlay, Button } from 'react-bootstrap'

import apis from '../../services/apis'
import SendAetDropdown from "../Export/SendAetDropdown"
import DownloadDropdown from "../Export/DownloadDropdown"
import { emptyExportList, removeSeriesFromExportList, removeStudyFromExportList } from '../../actions/ExportList'
import TableStudiesWithNestedSeries from '../CommonComponents/RessourcesDisplay/ReactTableV8/TableStudiesWithNestedSeries'
import { seriesColumns, studyColumns } from '../CommonComponents/RessourcesDisplay/ReactTableV8/ColomnFactories'
import { errorMessage } from '../../tools/toastify'

export default ({ target, show, onHide }) => {

    const [aets, setAets] = useState([])

    const store = useSelector(state => {
        return {
            seriesArray: state.ExportList.seriesArray,
            studyArray: state.ExportList.studyArray
        }
    })

    const dispatch = useDispatch()

    useEffect(() => {
        apis.aets.getAets().then(aets => setAets(aets)).catch((error) => {
            setAets([])
            errorMessage(error?.data?.errorMessage ?? "Can't Retrieve AETS")
        })
    }, [])


    const handleClickEmpty = () => {
        dispatch(emptyExportList())
    }

    const onRemoveSeries = (serieID) => {
        dispatch(removeSeriesFromExportList(serieID))
    }

    const additionalColumnsSeries = [
        seriesColumns.REMOVE(onRemoveSeries)
    ]
    const onRemoveStudy = (studyID) => {
        dispatch(removeStudyFromExportList(studyID))
    }

    const additionalColumnsStudies = [
        studyColumns.REMOVE(onRemoveStudy)
    ]

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
                            <Button className="btn otjs-button otjs-button-orange p-2"
                                onClick={handleClickEmpty}>Empty List
                            </Button>
                        </div>
                    </div>

                    <TableStudiesWithNestedSeries
                        studies={store.studyArray}
                        series={store.seriesArray}
                        withPatientColums
                        additionalColumnsStudies={additionalColumnsStudies}
                        additionalColumnsSeries={additionalColumnsSeries}
                    />
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