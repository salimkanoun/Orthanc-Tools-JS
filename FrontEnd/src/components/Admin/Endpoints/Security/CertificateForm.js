import React, { useState } from 'react'
import { Row, Col, Form, Button, FormGroup } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import { toast } from 'react-toastify'

import apis from '../../../../services/apis'

/**
 * Form to declare or modify an AET
 */
export default ({ refreshCertificatesData }) => {

    const [file, setFile] = useState(null);
    const [label, setLabel] = useState();
    const [inProgress, setInProgress] = useState();

    /**
     * Listener on form submission
     */
    const handleClick = async () => {
        try {
            let response = await apis.certificates.createCertificate(label)
            await apis.certificates.uploadCertificate(response, file)
            refreshCertificatesData()
        } catch (error) {
            toast.error(error.statusText, { data: { type: 'notification' } })
        }
    }

    const setFile0 = (file) => {
        setFile(file[0])
    }


    return (
        <Form>
            <h3 className="card-title">Add Certificate Authority</h3>

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
                <Col>
                    <FormGroup>
                        <Form.Label> Label : </Form.Label>
                        <Form.Control type="text" value={label} onChange={(event) => setLabel(event.target.value)} />
                    </FormGroup>
                </Col>
            </Row>

            <Row className="text-center mt-4">
                <Col>
                    <Button disabled={!file || !label} className='otjs-button otjs-button-blue' onClick={handleClick}> Send </Button>
                </Col>
            </Row>
        </Form>
    )

}
