import React, { Component, Fragment } from 'react'
import apis from '../../../../services/apis'
import Dropzone from 'react-dropzone'
import { toast } from 'react-toastify'
import { Row, Col } from 'react-bootstrap'
/**
 * Form to declare or modify an Ssh Keys
 */
export default class SshKeyForm extends Component {

    state = {
        file: null
    }

    /**
     * Fill input text of users in current state
     * @param {*} event 
     */
    handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.type === 'checkbox' ? target.checked : target.value

        this.setState({
            [name]: value
        })

    }

    /**
     * Listener on form submission
     */
    handleClick = async () => {
        try{
            let response = await apis.sshKeys.createKey(this.state.label, this.state.pass)
            await apis.sshKeys.uploadKey(response.id, this.state.file)
            this.props.refreshSshKeysData()
        } catch(error){
            toast.error(error.statusText)
        }

    }

    setFile = (file) => {
        this.setState({
            file: file[0]
        })
    }

    render = () => {
        return (
            <Fragment>
                <h3 className="card-title mt-4">Add Ssh Private Key</h3>
                <Dropzone onDrop={acceptedFile => this.setFile(acceptedFile)} >
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div className={this.state.inProgress ? "dropzone dz-parsing" : "dropzone"} {...getRootProps()} >
                                <input {...getInputProps()} />
                                <p>{!!this.state.file ? this.state.file.name : "Drop Private Key"}</p>
                            </div>
                        </section>
                    )}
                </Dropzone>
                <Row className="form-group mt-4 align-items-center">
                    <Col sm={2}>
                        <label htmlFor="label">Label : </label>
                    </Col>
                    <Col sm={4}>
                        <input type='text' name="label" className="form-control" onChange={this.handleChange} />   
                    </Col>
                    <Col sm={2}>
                        <label htmlFor="pass">Passphrase : </label>
                    </Col>
                    <Col sm={4}>
                        <input type='text' name="pass" className="form-control" onChange={this.handleChange} />
                    </Col>
                </Row>
                <Row className="mt-4 text-center">
                    <Col>
                        <input disabled={!this.state.file || !this.state.label} type='button' className='otjs-button otjs-button-blue' onClick={this.handleClick} value='Send' />

                    </Col>
                </Row>
            </Fragment>
        )
    }
}
