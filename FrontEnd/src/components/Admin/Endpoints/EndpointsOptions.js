import React, { useState } from "react"

import { Row, Col, Form, Button, FormGroup } from "react-bootstrap"
import Select from "react-select"

import { keys } from "../../../model/Constant"
import apis from "../../../services/apis"
import { useCustomMutation, useCustomQuery } from "../../../services/ReactQuery/hooks"


const TRANSCODING_OPTIONS = [
    { value: 'None', label: 'None (Original TS)' },
    { value: '1.2.840.10008.1.2', label: 'Implicit VR Endian' },
    { value: '1.2.840.10008.1.2.1', label: 'Explicit VR Little Endian' },
    { value: '1.2.840.10008.1.2.1.99', label: 'Deflated Explicit VR Little Endian' },
    { value: '1.2.840.10008.1.2.2', label: 'Explicit VR Big Endian' },
    { value: '1.2.840.10008.1.2.4.50', label: 'JPEG 8-bit' },
    { value: '1.2.840.10008.1.2.4.51', label: 'JPEG 12-bit' },
    { value: '1.2.840.10008.1.2.4.57', label: 'JPEG Lossless' },
    { value: '1.2.840.10008.1.2.4.70', label: 'JPEG Lossless' },
    { value: '1.2.840.10008.1.2.4.80', label: 'JPEG-LS Lossless' },
    { value: '1.2.840.10008.1.2.4.81', label: 'JPEG-LS Lossy' },
    { value: '1.2.840.10008.1.2.4.90', label: 'JPEG 2000 (90)' },
    { value: '1.2.840.10008.1.2.4.91', label: 'JPEG 2000 (91)' },
    { value: '1.2.840.10008.1.2.4.92', label: 'JPEG 2000 (92)' },
    { value: '1.2.840.10008.1.2.4.93', label: 'JPEG 2000 (93)' }

]

export default () => {

    const [export_transcoding, setExport_transcoding] = useState('')

    const {isLoading} = useCustomQuery(
        [keys.EXPORT_TRANSCODING],
        () => apis.options.getOptions(),
        undefined,
        undefined,
        (answer) => {
            setExport_transcoding(answer.export_transcoding)
        }
    )

    const handleChangeSelect = (event) => {
        setExport_transcoding(event)
    }

    const getSelectedObject = (objectArray, searchedValue) => {
        let filteredArray = objectArray.filter(item => {
            return item.value === searchedValue ? true : false
        })
        return filteredArray[0]
    }

    const sendForm = useCustomMutation(
        (export_transcoding) => apis.options.setExportOptions(export_transcoding),
        [[keys.EXPORT_TRANSCODING]]
    )

    return (
        <Form>
            <h2 className="card-title mt-5">Export Transcoding </h2>

            <Row>
                <FormGroup>
                    <Form.Label> Transfer Syntax : </Form.Label>
                    <Select single options={TRANSCODING_OPTIONS} value={getSelectedObject(TRANSCODING_OPTIONS, export_transcoding)} onChange={(event) => handleChangeSelect(event)} />
                </FormGroup>
            </Row>
            <Row >
                <Col>
                    <Button className="otjs-button otjs-button-blue mt-3"  onClick={() => sendForm.mutate({export_transcoding})}> Send </Button>
                </Col>
            </Row>

        </Form>
    )
}