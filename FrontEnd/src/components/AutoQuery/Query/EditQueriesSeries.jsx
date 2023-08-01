import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, Table } from "react-bootstrap";
import Select from "react-select";

import { editColumnQuery } from "../../../actions/TableQuery";

export default ({ aets = [], selectedRowsIds = [] }) => {

    const dispatch = useDispatch()

    const [selectedAets, setSelectedAets] = useState([])
    const [studyInstanceUID, setStudyInstanceUID] = useState()
    const [seriesInstanceUID, setSeriesInstanceUID] = useState()

    const aetsOptions = aets.map((aet) => ({ label: aet, value: aet }))

    const applyStudyInstanceUIDUpdate = () => {
        dispatch(editColumnQuery(selectedRowsIds, 'StudyInstanceUID', studyInstanceUID))
    }

    const applySeriesInstanceUIDUpdate = () => {
        dispatch(editColumnQuery(selectedRowsIds, 'SeriesInstanceUID', seriesInstanceUID))
    }

    const applyAetUpdate = () => {
        dispatch(editColumnQuery(selectedRowsIds, 'Aet', selectedAets.value))
    }

    return (
        <Table >
            <tr>
                <td>Study Instance UID</td>
                <td>
                    <Form.Control value={studyInstanceUID} onChange={(event) => setStudyInstanceUID(event.target.value)} />
                </td>
                <td>
                    <Button className="otjs-button otjs-button-blue" onClick={applyStudyInstanceUIDUpdate}>Apply</Button>
                </td>
            </tr>
            <tr>
                <td>Series Instance UID</td>
                <td>
                    <Form.Control value={seriesInstanceUID} onChange={(event) => setSeriesInstanceUID(event.target.value)} />
                </td>
                <td>
                    <Button className="otjs-button otjs-button-blue" onClick={applySeriesInstanceUIDUpdate}>Apply</Button>
                </td>
            </tr>
            <tr>
                <td>Aets</td>
                <td>
                    <Select options={aetsOptions} onChange={(option) => setSelectedAets(option)} value={selectedAets} />
                </td>
                <td>
                    <Button className="otjs-button otjs-button-blue" onClick={applyAetUpdate}>Apply</Button>
                </td>
            </tr>
        </Table>
    )
}