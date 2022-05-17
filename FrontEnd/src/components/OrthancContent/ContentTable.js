import { useState } from "react"
import { Row, Col } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { addStudiesToAnonList } from "../../actions/AnonList"
import { addStudiesToDeleteList } from "../../actions/DeleteList"
import { addStudiesToExportList } from "../../actions/ExportList"
import apis from "../../services/apis"
import TablePatientsWithNestedStudies from "../CommonComponents/RessourcesDisplay/ReactTable/TablePatientsWithNestedStudies"
import TableSeries from "../CommonComponents/RessourcesDisplay/ReactTable/TableSeries"
import SendToAnonExportDeleteDropdown from "../CommonComponents/RessourcesDisplay/SendToAnonExportDeleteDropdown"

export default ({ patients }) => {
    console.log(patients)
    const [series, setSeries] = useState([])
    const [selectedStudies, setSelectedStudies] = useState([])

    const dispatch = useDispatch()

    
    const onClickStudy = (StudyOrthancID)  => {
        apis.content.getSeriesDetails(StudyOrthancID).then((series) =>{
            let seriesMainDicomTags = series.map(series => { return {
                SeriesOrthancID : series.ID,
                ...series.MainDicomTags}
            })
             setSeries(seriesMainDicomTags)
            })
    }

    const onSendTo = (type) =>{
        let studies = []
        patients.forEach( (patient)=> {
            studies.push(...Object.values(patient.studies))
        })

        let filteredSelectedStudies = studies.filter(study => selectedStudies.includes(study.StudyOrthancID))

        if(type === "anon") dispatch(addStudiesToAnonList(filteredSelectedStudies))
        else if(type === "export") dispatch(addStudiesToExportList(filteredSelectedStudies))
        else if(type === "delete") dispatch(addStudiesToDeleteList(filteredSelectedStudies))
    }
    console.log(patients)
    return (
        <Row>
            <Col sm>
                <SendToAnonExportDeleteDropdown onSendTo={onSendTo}/>
                <TablePatientsWithNestedStudies
                    patients={patients}
                    selectable
                    onClickStudy = {onClickStudy}
                    onSelectStudies={(studieSelected) => {setSelectedStudies(studieSelected)}}
                />
            </Col>
            <Col sm>
                <TableSeries series={series} /*onDelete={onDelete}*/ />
            </Col>

        </Row>
    )
}