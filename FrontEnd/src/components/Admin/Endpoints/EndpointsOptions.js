import React, { Component } from "react"
import { Row, Col } from "react-bootstrap"
import Select from "react-select"
import { toast } from 'react-toastify'
import apis from "../../../services/apis"


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

export default class EndpointsOptions extends Component{

    state = {
        export_transcoding : ''
    }

    handleChangeSelect = (event, metadata) => {
        this.setState({
            [metadata.name]: event.value
        })

    }

    getSelectedObject = (objectArray, searchedValue) => {
        let filteredArray = objectArray.filter(item => {
            return item.value === searchedValue ? true : false
        })

        return filteredArray[0]
    }

    sendForm = async () => {
        try {
            await apis.options.setExportOptions(this.state.export_transcoding)
            await this.refreshData()
            toast.success('Export Settings updated')
        } catch (error) {
            toast.error(error.statusText)
        }

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

    render = () => {
        return (
            <div>
                <h2 className="card-title mt-5">Export Transcoding </h2>
                
                    <Row>
                        <Col sm={3}>
                            <label htmlFor="export_transcoding">Transfer Syntax : </label>
                        </Col>
                        <Col>
                            <Select single options={TRANSCODING_OPTIONS} name='export_transcoding' value={this.getSelectedObject(TRANSCODING_OPTIONS, this.state.export_transcoding)} onChange={this.handleChangeSelect} />
                        </Col>
                    </Row>
                    <Row className="text-center mt-3">
                        <Col>
                            <input type="button" className="otjs-button otjs-button-blue mt-3" value="Send" onClick={this.sendForm} />

                        </Col>
                    </Row>
               
            </div>
        )
    }
}