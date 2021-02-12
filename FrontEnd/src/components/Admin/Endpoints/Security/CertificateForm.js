import React, { Component, Fragment } from 'react'
import apis from '../../../../services/apis'
import Dropzone from 'react-dropzone'
import { toast } from 'react-toastify'

/**
 * Form to declare or modify an AET
 */
export default class CertificateForm extends Component {

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
            let response = await apis.certificates.createCertificate(this.state.label)
            await apis.certificates.uploadCertificate(response.id, this.state.file)
            this.props.refreshCertificatesData()
        }catch(error){
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
                <h3 className="card-title">Add Certificate Authority</h3>
                <div className="form-group">
                    <Dropzone onDrop={acceptedFile => this.setFile(acceptedFile)} >
                        {({ getRootProps, getInputProps }) => (
                            <section>
                                <div className={this.state.inProgress ? "dropzone dz-parsing" : "dropzone"} {...getRootProps()} >
                                    <input {...getInputProps()} />
                                    <p>{!!this.state.file ? this.state.file.name : "Drop Certificate file"}</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                    <label htmlFor="label">Label : </label>
                    <input type='text' name="label" className="form-control" onChange={this.handleChange} />
                </div>
                <div className="text-right mb-5">
                    <input disabled={!this.state.file || !this.state.label} type='button' className='row btn btn-primary' onClick={this.handleClick} value='send' />
                </div>
            </Fragment>
        )
    }
}
