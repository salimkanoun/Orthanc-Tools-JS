import React, { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { Row, Col, Button, Container } from "react-bootstrap"
import TableSeries from "../CommonComponents/RessourcesDisplay/ReactTableV8/TableSeries"
import TableStudies from "../CommonComponents/RessourcesDisplay/ReactTableV8/TableStudies"

import { emptyExportList, removeSeriesFromExportList, removeStudyFromExportList } from '../../actions/ExportList'

import DownloadDropdown from "./DownloadDropdown"
import SendAetDropdown from "./SendAetDropdown"
import SendPeerDropdown from "./SendPeerDropdown"
import SendExternalDropdown from "./SendExternalDropdown"
import Spinner from "../CommonComponents/Spinner"

import { useCustomQuery } from "../../services/ReactQuery/hooks"
import { errorMessage } from "../../tools/toastify"
import { exportCsv } from "../../tools/CSVExport"
import { keys } from "../../model/Constant"
import apis from '../../services/apis'

export default () => {

    const [currentStudy, setCurrentStudy] = useState(null)

    const dispatch = useDispatch()
    const store = useSelector(state => {
        return {
            exportList: state.ExportList,
            username: state.OrthancTools.username
        }
    })

    const { data: aets, isLoading: isLoadingAET } = useCustomQuery(
        [keys.AETS_KEY],
        () => apis.aets.getAets()
    )

    const { data: peers, isLoading: isPeersLoading } = useCustomQuery(
        [keys.PEERS_KEY],
        () => apis.peers.getPeers()
    )

    const { data: endpoints, isLoading: isEnpointsLoading } = useCustomQuery(
        [keys.ENDPOINTS_KEY],
        () => apis.endpoints.getEndpoints(),
        undefined,
        (data) => {
            return [...data, {
                id: -1,
                label: 'On Server Hard Disk',
                protocol: 'local',
            }]
        }
    )

    const { data: transferSyntax, isLoading: isLoadingTransferSyntax } = useCustomQuery(
        [keys.EXPORT_OPTION_KEYS],
        () => apis.options.getExportOption()
    )

    const onClickStudyHandler = (StudyOrthancID) => {
        setCurrentStudy(StudyOrthancID)
    }

    const rowStyle = (StudyOrthancID) => {
        if (StudyOrthancID === currentStudy) return { background: 'peachPuff' }
    }

    const exportIdArray = useMemo(() => {
        return store.exportList.seriesArray.map(series => (series.SeriesOrthancID))
    }, [store.exportList.seriesArray.length])

    const additionalColumnsSeries = [
        {
            id: 'Remove',
            accessorKey: 'Remove',
            header: 'Remove',
            cell: (({ row }) => {
                return (
                    <Button className="btn btn-danger" onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeSeriesFromExportList(row.original.SeriesOrthancID))
                    }}>Remove</Button>
                )
            })
        }
    ]

    const removeStudyHandler = () => {
        dispatch(removeStudyFromExportList(currentStudy))
    }

    const emptyListHandler = () => {
        dispatch(emptyExportList())
    }

    const getCSV = () => {
        if (store.exportList.seriesArray.length === 0) {
            errorMessage('Empty List')
            return
        }

        let csvData = store.exportList.seriesArray.map((series) => {
            let studydata = store.exportList.studyArray.find((study) => {
                return study.StudyOrthancID === series.StudyOrthancID
            })

            return ({
                patientId: studydata.ParentPatient.PatientID,
                patientName: studydata.ParentPatient.PatientName,
                studyDescription: studydata.StudyDescription,
                seriesNumber: series.SeriesNumber,
                seriesDate: series.SeriesDate,
                seriesTime: series.SeriesTime,
                seriesModality: series.Modality,
                numberOfInstances: series.NumberOfInstances,
                seriesDescription: series.SeriesDescription,
                seriesInstanceUID: series.SeriesInstanceUID,
                studyInstanceUID: studydata.StudyInstanceUID
            })
        });

        exportCsv(csvData, '.csv', 'ExportDicomDetails.csv')
    }

    const series = useMemo(
        () => store.exportList.seriesArray.filter(serie => serie.StudyOrthancID === currentStudy),
        [currentStudy, store.exportList.seriesArray])


    if (isEnpointsLoading || isLoadingAET || isLoadingTransferSyntax || isPeersLoading) {
        return <Spinner />
    }

    return (
        <Container fluid>
            <Row className="border-bottom border-2 pb-3">
                <Col className="d-flex justify-content-start align-items-center">
                    <i className="fas fa-file-export ico me-3"></i><h2 className="card-title">Export</h2>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <TableStudies
                        studies={store.exportList.studyArray}
                        onRowClick={onClickStudyHandler}
                        rowStyle={rowStyle}
                        withPatientColums
                        paginated />
                </Col>
                <Col>
                    <TableSeries series={series} additionalColumns={additionalColumnsSeries} />
                </Col>
            </Row>
            <Row>
                <Col className="d-flex justify-content-around">
                    <Button className='otjs-button otjs-button-red mt-2 w-10' onClick={removeStudyHandler}>
                        Remove Study
                    </Button>
                    <Button className='otjs-button otjs-button-red mt-2 w-7' onClick={emptyListHandler}>
                        Empty List
                    </Button>
                </Col>
                <Col></Col>
            </Row>
            <Row className="mt-5 pt-5 border-top border-2">
                <Col className="d-flex justify-content-around">
                    <DownloadDropdown exportIds={exportIdArray} TS={transferSyntax} />
                    <SendAetDropdown aets={aets} exportIds={exportIdArray} />
                    <SendPeerDropdown peers={peers} exportIds={exportIdArray} />
                    <SendExternalDropdown endpoints={endpoints} exportIds={exportIdArray}
                        username={store.username} />
                    <Button className="otjs-button otjs-button-blue w-12" onClick={getCSV}>
                        Download list as CSV
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}
