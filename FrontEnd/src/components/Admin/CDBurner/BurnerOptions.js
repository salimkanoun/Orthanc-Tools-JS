import React, { Component } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import apis from '../../../services/apis'
import { Row, Col } from 'react-bootstrap'
export default class BurnerOptions extends Component {

    state = {
        burner_monitored_path: '',
        burner_viewer_path: '',
        burner_label_path: '',
        burner_manifacturer: '',
        burner_monitoring_level: '',
        burner_support_type: '',
        burner_date_format: '',
        burner_delete_study_after_sent: false,
        burner_transfer_syntax: null

    }

    manufacturerOptions = [
        { value: 'Epson', label: 'Epson' },
        { value: 'Primera', label: 'Primera' }
    ]

    levelOptions = [
        { value: 'Study', label: 'Study' },
        { value: 'Patient', label: 'Patient' }
    ]

    supportType = [
        { value: 'Auto', label: 'Auto' },
        { value: 'CD', label: 'CD' },
        { value: 'DVD', label: 'DVD' }
    ]

    dateFormatOptions = [
        { value: 'uk', label: 'MMDDYYYY' },
        { value: 'fr', label: "DDMMYYYY" }
    ]

    transferSyntaxOptions = [
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


    handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.type === 'checkbox' ? target.checked : target.value

        this.setState({
            [name]: value
        })

    }

    handleChangeSelect = (event, metadata) => {
        this.setState({
            [metadata.name]: event.value
        })

    }

    onTSChange = (TSValue) => {
        this.setState({
            burner_transfer_syntax: TSValue
        })
    }

    refreshData = async () => {
        try {
            let options = await apis.options.getOptions()
            this.setState({
                ...options
            })
        } catch (error) {
            toast.error(error.statusText)
        }


    }
    componentDidMount = async () => {
        await this.refreshData()

    }

    getSelectedObject = (objectArray, searchedValue) => {
        let filteredArray = objectArray.filter(item => {
            return item.value === searchedValue ? true : false
        })

        return filteredArray[0]
    }

    sendForm = async () => {
        try {
            await apis.options.setBurnerOptions(this.state.burner_monitored_path,
                this.state.burner_viewer_path,
                this.state.burner_label_path,
                this.state.burner_manifacturer,
                this.state.burner_monitoring_level,
                this.state.burner_support_type,
                this.state.burner_date_format,
                this.state.burner_delete_study_after_sent,
                this.state.burner_transfer_syntax)
            await this.refreshData()
            toast.success('Burner Settings updated')
        } catch (error) {
            toast.error(error.statusText)
        }

    }

    render = () => {
        return (
            <div>
                <h2 className="card-title">CD/DVD Burner Options</h2>
                <Row className="mt-4 align-items-center">
                    <Col sm={2}>
                        <label htmlFor="burner_monitored_path">Monitored Folder :</label>
                    </Col>
                    <Col sm={4}>
                        <input type='text' className="form-control" name='burner_monitored_path' value={this.state.burner_monitored_path} onChange={this.handleChange} placeholder="Example : C:\\myPath\Epson" />
                    </Col>
                    <Col sm={2}>
                        <label htmlFor="burner_viewer_path">Viewer Folder : </label>
                    </Col>
                    <Col sm={4}>
                        <input type='text' className="form-control" name='burner_viewer_path' value={this.state.burner_viewer_path} onChange={this.handleChange} placeholder="Example : C:\\myPath\Viewer" />
                    </Col>

                </Row>
                <Row className="mt-4 align-items-center">
                    <Col sm={2}>
                        <label htmlFor="burner_label_path">Label Path : </label>
                    </Col>
                    <Col sm={4}>
                        <input type='text' className="form-control" name='burner_label_path' value={this.state.burner_label_path} onChange={this.handleChange} placeholder="Example : C:\\myPath\Label" />
                    </Col>
                    <Col sm={2}>
                        <label htmlFor="burner_transfer_syntax">Transfer Syntax : </label>
                    </Col>
                    <Col sm={4}>
                        <Select single options={this.transferSyntaxOptions} name='burner_transfer_syntax' value={this.getSelectedObject(this.transferSyntaxOptions, this.state.burner_transfer_syntax)} onChange={this.handleChangeSelect} />
                    </Col>
                </Row>
                <Row className="mt-4 align-items-center">
                    <Col sm={2}>
                        <label htmlFor="burner_manifacturer">Manufacturer : </label>
                    </Col>
                    <Col sm={4}>
                        <Select single options={this.manufacturerOptions} value={this.getSelectedObject(this.manufacturerOptions, this.state.burner_manifacturer)} onChange={this.handleChangeSelect} name="burner_manifacturer" />
                    </Col>
                    <Col sm={2}>
                        <label htmlFor="burner_monitoring_level">Monitoring Level : </label>
                    </Col>
                    <Col sm={4}>
                        <Select options={this.levelOptions} value={this.getSelectedObject(this.levelOptions, this.state.burner_monitoring_level)} onChange={this.handleChangeSelect} name="burner_monitoring_level" />
                    </Col>

                </Row>
                <Row className="mt-4 align-items-center">
                    <Col sm={2}>
                        <label htmlFor="burner_date_format">Date Format : </label>
                    </Col>
                    <Col sm={4}>
                        <Select options={this.dateFormatOptions} value={this.getSelectedObject(this.dateFormatOptions, this.state.burner_date_format)} onChange={this.handleChangeSelect} name="burner_date_format" />
                    </Col>
                    <Col sm={2}>
                        <label htmlFor="burner_support_type">Support Type : </label>
                    </Col>
                    <Col sm={4}>
                        <Select single options={this.supportType} value={this.getSelectedObject(this.supportType, this.state.burner_support_type)} onChange={this.handleChangeSelect} name="burner_support_type" />
                    </Col>

                </Row>
                <Row className="mt-4 align-items-center">
                    <Col sm={5}>
                        <label htmlFor="burner_delete_study_after_sent">Delete Original Images From Orthanc : </label>
                    </Col>
                    <Col sm={2}>
                        <input type="checkbox" checked={this.state.burner_delete_study_after_sent} name="burner_delete_study_after_sent" value="Delete Original Study/Patient" onChange={this.handleChange} />
                    </Col>

                </Row>
                <Row className="text-center mt-4">
                    <Col>
                        <input type="button" className="otjs-button otjs-button-blue" value="Send" onClick={this.sendForm} />
                    </Col>
                </Row>
            </div>
        )
    }

}