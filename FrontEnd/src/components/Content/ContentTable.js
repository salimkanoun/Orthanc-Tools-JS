import { useState } from "react"
import { Row, Col } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { addStudiesToAnonList } from "../../actions/AnonList"
import { addStudiesToDeleteList } from "../../actions/DeleteList"
import { addStudiesToExportList } from "../../actions/ExportList"
import apis from "../../services/apis"
import SendToAnonExportDeleteDropdown from "../CommonComponents/RessourcesDisplay/SendToAnonExportDeleteDropdown"

import TablePatientWithNestedStudies from "../CommonComponents/RessourcesDisplay/ReactTableV8/TablePatientWithNestedStudies"
import TableSeries from "../CommonComponents/RessourcesDisplay/ReactTableV8/TableSeries"

import Series from '../../model/Series'
import { patientColumns, seriesColumns, studyColumns } from "../CommonComponents/RessourcesDisplay/ReactTableV8/ColomnFactories"

export default ({ patients }) => {

    const [series, setSeries] = useState([])
    const [selectedStudies, setSelectedStudies] = useState([])
    const [currentStudy, setCurrentStudy] = useState('')

    const dispatch = useDispatch()

    const onClickStudy = (StudyOrthancID) => {
        apis.content.getSeriesDetails(StudyOrthancID).then((series) => {
            let seriesObjects = series.map(series => {
                let seriesObject = new Series()
                seriesObject.fillFromOrthanc(series.ID, series.MainDicomTags, series.Instances, series.ParentStudy)
                return seriesObject
            })
            let rows = seriesObjects.map(series => series.serialize())
            setSeries(rows)
        })
        setCurrentStudy(StudyOrthancID)
    }

    const onSendTo = (type) => {
        console.log(selectedStudies)
        let studies = []
        patients.forEach((patient) => {
            studies.push(...Object.values(patient.Studies))
        })

        let filteredSelectedStudies = studies.filter(study => selectedStudies.includes(study.StudyOrthancID))

        if (type === "anon") dispatch(addStudiesToAnonList(filteredSelectedStudies))
        else if (type === "export") dispatch(addStudiesToExportList(filteredSelectedStudies))
        else if (type === "delete") dispatch(addStudiesToDeleteList(filteredSelectedStudies))
    }

    const additionalColumnsPatients = [
        patientColumns.ACTION()
    ]

    const additionalColumnsStudies = [
        studyColumns.ACTION()
    ]

    const additionalColumnsSeries = [
        seriesColumns.ACTION()
    ]

    const rowStyle = (StudyOrthancID) => {
        if (StudyOrthancID === currentStudy) return { background: 'peachPuff' }
    }

    return (

        <Row>
            <Col sm>
                <SendToAnonExportDeleteDropdown onSendTo={onSendTo} />

                <TablePatientWithNestedStudies
                    patients={patients}
                    onClickStudy={onClickStudy}
                    rowStyle={rowStyle}
                    selectable
                    onSelectStudies={(studiesSelected) => { setSelectedStudies(studiesSelected) }}
                    additionalColumnsPatients={additionalColumnsPatients}
                    additionalColumnsStudies={additionalColumnsStudies}
                />
            </Col>
            <Col sm>
                <TableSeries series={series} additionalColumns={additionalColumnsSeries} />
            </Col>

        </Row>
    )
}