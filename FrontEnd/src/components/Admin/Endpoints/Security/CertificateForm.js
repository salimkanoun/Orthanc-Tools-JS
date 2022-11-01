import React, { Fragment, useState } from 'react'
import apis from '../../../../services/apis'
import Dropzone from 'react-dropzone'
import { toast } from 'react-toastify'
import { Row, Col } from 'react-bootstrap'

/**
 * Form to declare or modify an AET
 */
export default ({ refreshCertificatesData }) => {

    const [file, setFile] = useState(null);
    const [name, setName] = useState();
    const [label, setLabel] = useState();
    const [inProgress, setInProgress] = useState();

    /**
     * Fill input text of users in current state
     * @param {*} event 
     */
    const handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.type === 'checkbox' ? target.checked : target.value

        setName(value)

    }

    /**
     * Listener on form submission
     */
    const handleClick = async () => {
        try {
            let response = await apis.certificates.createCertificate(label)
            await apis.certificates.uploadCertificate(response, file)
            refreshCertificatesData()
        } catch (error) {
            toast.error(error.statusText)
        }


    }

    const setFile0 = (file) => {
        setFile(file[0])
    }


    return (
        <Fragment>
            <h3 className="card-title">Add Certificate Authority</h3>
            <div className="form-group">
                <Dropzone onDrop={acceptedFile => setFile0(acceptedFile)} >
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div className={inProgress ? "dropzone dz-parsing" : "dropzone"} {...getRootProps()} >
                                <input {...getInputProps()} />
                                <p>{!!file ? file.name : "Drop Certificate file"}</p>
                            </div>
                        </section>
                    )}
                </Dropzone>
                <Row>
                    <Col sm={2}>
                        <label htmlFor="label">Label : </label>

                    </Col>
                    <Col sm={10}>
                        <input type='text' name="label" className="form-control" onChange={handleChange} />
                    </Col>
                </Row>

            </div>
            <Row className="text-center mt-4">
                <Col>
                    <input disabled={!file || !label} type='button' className='otjs-button otjs-button-blue' onClick={handleClick} value='Send' />
                </Col>
            </Row>
        </Fragment>
    )

}
