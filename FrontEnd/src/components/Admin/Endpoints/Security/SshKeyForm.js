import React, { useState } from 'react'
import apis from '../../../../services/apis'
import Dropzone from 'react-dropzone'
import { Row, Col, Form, FormGroup, Button } from 'react-bootstrap'
import { keys } from '../../../../model/Constant'
import { useCustomMutation } from '../../../../services/ReactQuery/hooks'

/**
 * Form to declare or modify an Ssh Keys
 */
export default () => {

    const [file, setFile] = useState(null);
    const [label, setLabel] = useState();
    const [pass, setPass] = useState();
    const [inProgress, setInProgress] = useState();

    /**
     * Fill input text of users in current state
     * @param {*} event 
     */

    /**
     * Listener on form submission
     */

    const sendSsh = useCustomMutation(
        ({ label, pass, file }) => {
            let response = apis.sshKeys.createKey(label, pass)
            apis.sshKeys.uploadKey(response.id, file)
        },
        [[keys.SSH_KEY]]
    )

    const setFile0 = (file) => {
        setFile(file[0])
    }

    return (
        <Form>
            <h3 className="card-title mt-4">Add Ssh Private Key</h3>
            <Dropzone onDrop={acceptedFile => setFile0(acceptedFile)} >
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div className={inProgress ? "dropzone dz-parsing" : "dropzone"} {...getRootProps()} >
                            <input {...getInputProps()} />
                            <p>{!!file ? file.name : "Drop Private Key"}</p>
                        </div>
                    </section>
                )}
            </Dropzone>

            <Row>
                <Col>
                    <FormGroup>
                        <Form.Label> Label :</Form.Label>
                        <Form.Control type="text" value={label} placeholder="Label" onChange={(event) => setLabel(event.target.value)} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Form.Label> Passphrase : </Form.Label>
                        <Form.Control type="text" value={pass} placeholder="Passphrase" onChange={(event) => setPass(event.target.value)} />
                    </FormGroup>
                </Col>
            </Row>
            <Row className="mt-4 text-center">
                <Col>
                    <Button disabled={!file || !label} className='otjs-button otjs-button-blue' onClick={() => sendSsh.mutate({ label, pass, file })}> Send </Button> 
                </Col>
            </Row>
        </Form>
    )

}
