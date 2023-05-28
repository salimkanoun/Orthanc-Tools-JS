import React, { useState } from "react";
import { Form } from "react-bootstrap";

export default ({ aets = [], selectedRowsIds = [] }) => {

    const [studyDescription, setStudyDescription] = useState('')
    const [modalities, setModalities] = useState([])
    const [selectedAets, setSelectedAets] = useState([])
    const [dateFrom, setDateFrom] = useState([])
    const [dateTo, setDateTo] = useState([])

    const aetsOptions = aets.map((aet) => ({ label: aet, value: aet }))
    return (
        <Form>
            <Form.Control>

            </Form.Control>
        </Form>
    )
}