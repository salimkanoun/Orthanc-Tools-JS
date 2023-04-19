import React, { useState } from "react"

import { Row, Col } from "react-bootstrap"
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

export default ({
    patients,
    refreshSearch
}) => {
    const SEND_TYPE_ANON = "anon"
    const SEND_TYPE_EXPORT = "export"
    const SEND_TYPE_DELETE = "delete"

    const [selectedStudies, setSelectedStudies] = useState([])
    const [currentStudy, setCurrentStudy] = useState(null)

    const dispatch = useDispatch()

    const { data: series, refetch } = useCustomQuery(
        ['orthanc', 'series', [currentStudy]],
        () => apis.content.getSeriesDetails(currentStudy),
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

        if (type === SEND_TYPE_ANON) dispatch(addStudiesToAnonList(filteredSelectedStudies))
        else if (type === SEND_TYPE_EXPORT) dispatch(addStudiesToExportList(filteredSelectedStudies))
        else if (type === SEND_TYPE_DELETE) dispatch(addStudiesToDeleteList(filteredSelectedStudies))
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

    return (

        <Row>
            <Col sm>
                <SendToAnonExportDeleteDropdown onSendTo={onSendTo} />

                <ContentTablePatientWithNestedStudies
                    patients={patients}
                    onClickStudy={(studyInstanceUID) => setCurrentStudy(studyInstanceUID)}
                    rowStyle={rowStyle}
                    onSelectStudies={(studiesSelected) => setSelectedStudies(studiesSelected)}
                    onDeletePatient={(patientOrthancID) => deletePatientMutation.mutate({ patientOrthancID })}
                    onDeleteStudy={(studyOrthancID) => deleteStudyMutation.mutate({ studyOrthancID })}
                />
            </Col>
            <Col sm>
                <ContentTableSeries series={series} onDelete={() => refetch()} />
            </Col>

        </Row>
    )
}