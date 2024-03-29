import React, { useEffect, useState } from "react"

import { Row, Col, Modal } from "react-bootstrap"
import { useDispatch } from "react-redux"

import { addStudiesToAnonList } from "../../actions/AnonList"
import { addStudiesToDeleteList } from "../../actions/DeleteList"
import { addStudiesToExportList } from "../../actions/ExportList"
import SendToAnonExportDeleteDropdown from "../CommonComponents/RessourcesDisplay/SendToAnonExportDeleteDropdown"
import ContentTableSeries from "./ContentTableSeries"
import ContentTablePatientWithNestedStudies from "./ContentTablePatientWithNestedStudies"
import Series from '../../model/Series'

import apis from "../../services/apis"
import { useCustomMutation, useCustomQuery } from "../../services/ReactQuery/hooks"
import { errorMessage } from "../../tools/toastify"
import { send_type } from "../../model/Constant"
import LabelManagementRoot from "./LabelManagement/LabelManagementRoot"

export default ({
    patients,
    refreshSearch
}) => {

    const [showLabelAssignement, setShowLabelAssignement] = useState(false)
    const [selectedStudies, setSelectedStudies] = useState([])
    const [currentStudy, setCurrentStudy] = useState(null)

    const dispatch = useDispatch()

    useEffect(() => {
        //Empty series list if a new patients list has come
        setCurrentStudy(null)
    }, [patients])

    const { data: series, refetch } = useCustomQuery(
        ['orthanc', 'series', currentStudy],
        () => currentStudy ? apis.content.getSeriesDetailsOfStudy(currentStudy) : [],
        undefined,
        (series) => {
            let seriesObjects = series.map(series => {
                let seriesObject = new Series()
                seriesObject.fillFromOrthanc(series.ID, series.MainDicomTags, series.Instances, series.ParentStudy)
                return seriesObject
            })
            let seriesArray = seriesObjects.map(series => series.serialize())
            return seriesArray
        }

    )

    const onSendTo = (type) => {
        let studies = []
        patients.forEach((patient) => {
            studies.push(...Object.values(patient.Studies))
        })

        let filteredSelectedStudies = studies.filter(study => selectedStudies.includes(study.StudyOrthancID))

        if (type === send_type.ANON) dispatch(addStudiesToAnonList(filteredSelectedStudies))
        else if (type === send_type.EXPORT) dispatch(addStudiesToExportList(filteredSelectedStudies))
        else if (type === send_type.DELETE) dispatch(addStudiesToDeleteList(filteredSelectedStudies))
        else if (type === send_type.LABEL) setShowLabelAssignement(true)
    }

    const rowStyle = (StudyOrthancID) => {
        if (StudyOrthancID === currentStudy) return { background: 'peachPuff' }
    }

    const deletePatientMutation = useCustomMutation(
        ({ patientOrthancID }) => apis.content.deletePatient(patientOrthancID),
        [],
        () => refreshSearch(),
        (error) => errorMessage(error?.data?.errorMessage ?? 'Failed')
    )

    const deleteStudyMutation = useCustomMutation(
        ({ studyOrthancID }) => apis.content.deleteStudies(studyOrthancID),
        [],
        () => refreshSearch(),
        (error) => errorMessage(error?.data?.errorMessage ?? 'Failed')
    )

    const deleteSerieMutation = useCustomMutation(
        ({ serieOrthancID }) => apis.content.deleteSeries(serieOrthancID),
        [],
        () => refetch(),
        (error) => errorMessage(error?.data?.errorMessage ?? 'Failed')
    )

    return (

        <Row>
            <Modal show={showLabelAssignement} onHide={() => setShowLabelAssignement(false)} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Labels Management</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LabelManagementRoot selectedOrthancStudyIds={selectedStudies} />
                </Modal.Body>
            </Modal>
            <Col sm>
                <SendToAnonExportDeleteDropdown onSendTo={onSendTo} />

                <ContentTablePatientWithNestedStudies
                    patients={patients}
                    onClickStudy={(studyInstanceUID) => setCurrentStudy(studyInstanceUID)}
                    rowStyle={rowStyle}
                    onSelectStudies={(studiesSelected) => setSelectedStudies(studiesSelected)}
                    onDeletePatient={(patientOrthancID) => deletePatientMutation.mutate({ patientOrthancID })}
                    onDeleteStudy={(studyOrthancID) => deleteStudyMutation.mutate({ studyOrthancID })}
                    onCreatedSeries={() => refetch()}
                />
            </Col>
            <Col sm>
                <ContentTableSeries series={series} onDelete={(serieOrthancID) => deleteSerieMutation.mutate({ serieOrthancID })} />
            </Col>

        </Row>
    )
}