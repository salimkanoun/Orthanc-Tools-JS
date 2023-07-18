import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, Table } from "react-bootstrap";
import Select from "react-select";
import moment from "moment";

import SelectModalities from "../../CommonComponents/SearchForm/SelectModalities";
import CalendarUtc from "../../CommonComponents/CalendarUtc";
import { editColumnQuery } from "../../../actions/TableQuery";

export default ({ aets = [], selectedRowsIds = [] }) => {

    const dispatch = useDispatch()

    const [studyDescription, setStudyDescription] = useState('')
    const [modalities, setModalities] = useState([])
    const [selectedAets, setSelectedAets] = useState([])
    const [dateFrom, setDateFrom] = useState([])
    const [dateTo, setDateTo] = useState([])

    const aetsOptions = aets.map((aet) => ({ label: aet, value: aet }))

    const applyStudyDescriptionUpdate = () => {
        dispatch(editColumnQuery(selectedRowsIds, 'StudyDescription', studyDescription))
    }

    const applyModalitiesUpdate = () => {
        dispatch(editColumnQuery(selectedRowsIds, 'ModalitiesInStudy', modalities))
    }

    const applyAetUpdate = () => {
        dispatch(editColumnQuery(selectedRowsIds, 'Aet', selectedAets.value))
    }

    const applyDateFrom = () => {
        const dateString = moment(dateFrom).format('YYYYMMDD')
        dispatch(editColumnQuery(selectedRowsIds, 'DateFrom', dateString))
    }

    const applyDateTo = () => {
        const dateString = moment(dateTo).format('YYYYMMDD')
        dispatch(editColumnQuery(selectedRowsIds, 'DateTo', dateString))
    }

    return (
        <Table >
            <tr>
                <td>Study Description</td>
                <td>
                    <Form.Control value={studyDescription} onChange={(event) => setStudyDescription(event.target.value)} />
                </td>
                <td>
                    <Button className="otjs-button otjs-button-blue" onClick={applyStudyDescriptionUpdate}>Apply</Button>
                </td>
            </tr>
            <tr>
                <td>Modalities</td>
                <td>
                    <SelectModalities previousModalities={''} onChange={(modalityString) => setModalities(modalityString)} />
                </td>
                <td>
                    <Button className="otjs-button otjs-button-blue" onClick={applyModalitiesUpdate}>Apply</Button>
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
            <tr>
                <td>Date Form</td>
                <td><CalendarUtc value={dateFrom} onChange={(date) => setDateFrom(date)} /></td>
                <td>
                    <Button className="otjs-button otjs-button-blue" onClick={applyDateFrom}>Apply</Button>
                </td>
            </tr>
            <tr>
                <td>Date To</td>
                <td><CalendarUtc value={dateTo} onChange={(date) => setDateTo(date)} /></td>
                <td>
                    <Button className="otjs-button otjs-button-blue" onClick={applyDateTo}>Apply</Button>
                </td>
            </tr>
        </Table>
    )
}