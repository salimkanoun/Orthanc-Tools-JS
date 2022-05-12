import { useState } from "react"
import { Row, Col } from "react-bootstrap"
import TablePatientsWithNestedStudies from "../CommonComponents/RessourcesDisplay/ReactTable/TablePatientsWithNestedStudies"
import TableSeries from "../CommonComponents/RessourcesDisplay/ReactTable/TableSeries"

export default ({ patients }) => {
    console.log(patients)
    const [series, setSeries] = useState([])

    return (
        <Row>
            <Col sm>
                <TablePatientsWithNestedStudies
                    patients={patients}
                    selectable
                />
            </Col>
            <Col sm>
                <TableSeries series={series} /*onDelete={onDelete}*/ />
            </Col>

        </Row>
    )
}