import React, { Fragment, useState } from 'react'
import apis from '../../../../services/apis'
import Dropzone from 'react-dropzone'
import { toast } from 'react-toastify'
import { Row, Col } from 'react-bootstrap'
/**
 * Form to declare or modify an Ssh Keys
 */
export default ({ refreshSshKeysData }) => {

    const [file, setFile] = useState(null);
    const [name, setName] = useState();
    const [label, setLabel] = useState();
    const [pass, setPass] = useState();
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
            let response = await apis.sshKeys.createKey(label, pass)
            await apis.sshKeys.uploadKey(response.id, file)
            refreshSshKeysData()
        } catch (error) {
            toast.error(error.statusText)
        }

    }

    const setFile0 = (file) => {
        setFile(file[0])
    }

    return (
        <Fragment>
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
            <Row className="form-group mt-4 align-items-center">
                <Col sm={2}>
                    <label htmlFor="label">Label : </label>
                </Col>
                <Col sm={4}>
                    <input type='text' name="label" className="form-control" onChange={handleChange} />
                </Col>
                <Col sm={2}>
                    <label htmlFor="pass">Passphrase : </label>
                </Col>
                <Col sm={4}>
                    <input type='text' name="pass" className="form-control" onChange={handleChange} />
                </Col>
            </Row>
            <Row className="mt-4 text-center">
                <Col>
                    <input disabled={!file || !label} type='button' className='otjs-button otjs-button-blue' onClick={handleClick} value='Send' />

                </Col>
            </Row>
        </Fragment>
    )

}
