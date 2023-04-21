import React, { useState } from 'react'
import { Row, Col, Form, Button, FormGroup } from 'react-bootstrap'
import Dropzone from 'react-dropzone'

import { keys } from '../../../../model/Constant'
import apis from '../../../../services/apis'
import { useCustomMutation } from '../../../../services/ReactQuery/hooks'

/**
 * Form to declare or modify an AET
 */
export default () => {

    const [file, setFile] = useState(null);
    const [label, setLabel] = useState();
    const [inProgress, setInProgress] = useState();

    /**
     * Listener on form submission
     */

    const handleClick = useCustomMutation(
        ({ label, file }) => {
            let response = apis.certificates.createCertificate(label)
            apis.certificates.uploadCertificate(response, file)
        },
        [[keys.CERTIFICATES_KEY]]
    )

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
                    <Button disabled={!file || !label} className='otjs-button otjs-button-blue' onClick={() => handleClick.mutate(label, file)}> Send </Button>
                </Col>
            </Row>
        </Form>
    )

}
