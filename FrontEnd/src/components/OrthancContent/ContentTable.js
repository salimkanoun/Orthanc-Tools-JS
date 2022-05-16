import { useState } from "react"
import { Row, Col } from "react-bootstrap"
import apis from "../../services/apis"
import TablePatientsWithNestedStudies from "../CommonComponents/RessourcesDisplay/ReactTable/TablePatientsWithNestedStudies"
import TableSeries from "../CommonComponents/RessourcesDisplay/ReactTable/TableSeries"

export default ({ patients }) => {
    console.log(patients)
    const [series, setSeries] = useState([])

    
    const onClickStudy = (StudyOrthancID)  => {
        apis.content.getSeriesDetails(StudyOrthancID).then((series) =>{
            let seriesMainDicomTags = series.map(series => { return {
                SeriesOrthancID : series.ID,
                ...series.MainDicomTags}
            })
             setSeries(seriesMainDicomTags)
            })
    }

    return (
        <Row>
            <Col sm>
                <TablePatientsWithNestedStudies
                    patients={patients}
                    selectable
                    onClickStudy = {onClickStudy}
                />
            </Col>
            <Col sm>
                <TableSeries series={series} /*onDelete={onDelete}*/ />
            </Col>

        </Row>
    )
}