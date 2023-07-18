import React, { useState } from 'react'
import { Row, Col, Form, FormGroup, Button } from 'react-bootstrap'
import Select from 'react-select'

import Spinner from '../../CommonComponents/Spinner'
import apis from '../../../services/apis'
import { errorMessage, successMessage } from '../../../tools/toastify'
import { keys } from '../../../model/Constant'
import { useCustomMutation, useCustomQuery } from '../../../services/ReactQuery/hooks'

export default () => {

    const [burner, setBurner] = useState({
        burner_monitored_path: '',
        burner_viewer_path: '',
        burner_label_path: '',
        burner_manifacturer: '',
        burner_monitoring_level: '',
        burner_support_type: '',
        burner_date_format: '',
        burner_delete_study_after_sent: false,
        burner_transfer_syntax: null
    })

    const manufacturerOptions = [
        { value: 'Epson', label: 'Epson' },
        { value: 'Primera', label: 'Primera' }
    ]

    const levelOptions = [
        { value: 'Study', label: 'Study' },
        { value: 'Patient', label: 'Patient' }
    ]

    const supportType = [
        { value: 'Auto', label: 'Auto' },
        { value: 'CD', label: 'CD' },
        { value: 'DVD', label: 'DVD' }
    ]

    const dateFormatOptions = [
        { value: 'uk', label: 'MMDDYYYY' },
        { value: 'fr', label: "DDMMYYYY" }
    ]

    const transferSyntaxOptions = [
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

    const { isLoading } = useCustomQuery(
        [keys.BURNER_KEY],
        () => apis.options.getOptions(),
        undefined,
        undefined,
        (answer) => {
            setBurner({
                burner_monitored_path: answer.burner_monitored_path,
                burner_viewer_path: answer.burner_viewer_path,
                burner_label_path: answer.burner_label_path,
                burner_manifacturer: answer.burner_manifacturer,
                burner_monitoring_level: answer.burner_monitoring_level,
                burner_support_type: answer.burner_support_type,
                burner_date_format: answer.burner_date_format,
                burner_delete_study_after_sent: answer.burner_delete_study_after_sent,
                burner_transfer_syntax: answer.burner_transfer_syntax
            })
        },
    )

    const sendForm = useCustomMutation(
        ({ burner_monitored_path, burner_viewer_path, burner_label_path, burner_manifacturer,
            burner_monitoring_level, burner_support_type, burner_date_format,
            burner_delete_study_after_sent, burner_transfer_syntax }) => {
            return apis.options.setBurnerOptions(
                burner_monitored_path,
                burner_viewer_path,
                burner_label_path,
                burner_manifacturer,
                burner_monitoring_level,
                burner_support_type,
                burner_date_format,
                burner_delete_study_after_sent,
                burner_transfer_syntax
            )
        },
        [[keys.BURNER_KEY]],
        () => successMessage("Updated"),
        () => errorMessage('Error')
    )


    const handleChange = (key, value) => {
        setBurner((burner) => ({
            ...burner,
            [key]: value
        }))
    }

    const getSelectedObject = (objectArray, searchedValue) => {
        return objectArray.find(option => option.value === searchedValue)
    }

    if (isLoading) return <Spinner />

    return (
        <Form>
            <h2 className="card-title">CD/DVD Burner Options</h2>

            <Row>
                <Col>
                    <FormGroup>
                        <Form.Label>Monitored Folder :</Form.Label>
                        <Form.Control type="text" value={burner.burner_monitored_path} placeholder="Example : C:\\myPath\Epson" onChange={(event) => handleChange('burner_monitored_path', event.target.value)} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Form.Label>Viewer Folder :</Form.Label>
                        <Form.Control type="text" value={burner.burner_viewer_path} placeholder="Example : C:\\myPath\Viewer" onChange={(event) => handleChange('burner_viewer_path', event.target.value)} />
                    </FormGroup>
                </Col>
            </Row>

            <Row >
                <Col>
                    <FormGroup>
                        <Form.Label>Label Path : </Form.Label>
                        <Form.Control type="text" value={burner.burner_label_path} placeholder="Example : C:\\myPath\Label" onChange={(event) => handleChange('burner_label_path', event.target.value)} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Form.Label>Transfer Syntax :</Form.Label>
                        <Select value={getSelectedObject(transferSyntaxOptions, burner.burner_transfer_syntax)} options={transferSyntaxOptions} onChange={(option) => handleChange('burner_transfer_syntax', option.value)} />
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col>
                    <FormGroup>
                        <Form.Label>Manufacturer : </Form.Label>
                        <Select value={getSelectedObject(manufacturerOptions, burner.burner_manifacturer)} options={manufacturerOptions} onChange={(option) => handleChange('burner_manifacturer', option.value)} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Form.Label>Monitoring Level : </Form.Label>
                        <Select value={getSelectedObject(levelOptions, burner.burner_monitoring_level)} options={levelOptions} onChange={(option) => handleChange('burner_monitoring_level', option.value)} />
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col>
                    <FormGroup>
                        <Form.Label>Date Format :</Form.Label>
                        <Select value={getSelectedObject(dateFormatOptions, burner.burner_date_format)} options={dateFormatOptions} onChange={(option) => handleChange('burner_date_format', option.value)} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Form.Label>Support Type :</Form.Label>
                        <Select value={getSelectedObject(supportType, burner.burner_support_type)} options={supportType} onChange={(option) => handleChange('burner_support_type', option.value)} />
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Label>Delete Original Images From Orthanc :</Form.Label>
                </Col>
                <Col>
                    <Form.Check checked={burner.burner_delete_study_after_sent} onChange={(event) => handleChange('burner_delete_study_after_sent', event.target.checked)} />
                </Col>
            </Row>

            <FormGroup>
                <Row className="d-flex justify-content-end">
                    <Button onClick={() => sendForm.mutate({ ...burner })} className='otjs-button otjs-button-blue'> Send </Button>
                </Row>
            </FormGroup>
        </Form>
    )

}