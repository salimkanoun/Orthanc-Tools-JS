import { useCallback, useEffect, useState } from "react"
import { Row, Col } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { addStudiesToAnonList } from "../../actions/AnonList"
import { addStudiesToDeleteList } from "../../actions/DeleteList"
import { addStudiesToExportList } from "../../actions/ExportList"
import apis from "../../services/apis"
import SendToAnonExportDeleteDropdown from "../CommonComponents/RessourcesDisplay/SendToAnonExportDeleteDropdown"

import Series from '../../model/Series'
import ContentTableSeries from "./ContentTableSeries"
import ContentTablePatientWithNestedStudies from "./ContentTablePatientWithNestedStudies"

export default ({patients}) => {

    const [selectedStudies, setSelectedStudies] = useState([])
    const [currentStudy, setCurrentStudy] = useState('')
    const [series, setSeries] = useState([])

    const dispatch = useDispatch()

    const refreshSeries = useCallback(() => {

        const fetchSeries = async () => {
            let series = await apis.content.getSeriesDetails(currentStudy).then((series) => {
                let seriesObjects = series.map(series => {
                    let seriesObject = new Series()
                    seriesObject.fillFromOrthanc(series.ID, series.MainDicomTags, series.Instances, series.ParentStudy)
                    return seriesObject
                })
                let seriesArray = seriesObjects.map(series => series.serialize())
                return seriesArray
            })

            setSeries(series)
        }
        fetchSeries()
    }, [currentStudy])

    useEffect(() => {
        refreshSeries()
    }, [currentStudy])

    const onSendTo = (type) => {
        let studies = []
        patients.forEach((patient) => {
            studies.push(...Object.values(patient.Studies))
        })

        let filteredSelectedStudies = studies.filter(study => selectedStudies.includes(study.StudyOrthancID))

        if (type === "anon") dispatch(addStudiesToAnonList(filteredSelectedStudies))
        else if (type === "export") dispatch(addStudiesToExportList(filteredSelectedStudies))
        else if (type === "delete") dispatch(addStudiesToDeleteList(filteredSelectedStudies))
    }

    const rowStyle = (StudyOrthancID) => {
        if (StudyOrthancID === currentStudy) return { background: 'peachPuff' }
    }

    return (

        <Row>
            <Col sm>
                <SendToAnonExportDeleteDropdown onSendTo={onSendTo} />

                <ContentTablePatientWithNestedStudies
                    patients={patients}
                    onClickStudy={(studyInstanceUID) => setCurrentStudy(studyInstanceUID)}
                    rowStyle={rowStyle}
                    onSelectStudies={(studiesSelected) => setSelectedStudies(studiesSelected)}
                    //onDelete = {}
                />
            </Col>
            <Col sm>
                <ContentTableSeries series={series} onDelete={() => refreshSeries()} />
            </Col>

        </Row>
    )
}