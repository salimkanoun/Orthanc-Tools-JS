import React, { Component, Fragment } from 'react'
import apis from '../../../services/apis'
import Dropzone from 'react-dropzone'

/**
 * Form to declare or modify an AET
 */
export default class CertificateForm extends Component {
    state = {
        file: null
    }

    constructor(props) {
        super(props)
        this.handleChange=this.handleChange.bind(this)
        this.handleClick=this.handleClick.bind(this)
    }

    /**
     * Fill input text of users in current state
     * @param {*} event 
     */
    handleChange(event) {
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
    async handleClick() {

        let postData = {
            label : this.state.label
        }

        let response = await apis.certificates.createCertificate(postData)
        await apis.certificates.uploadCertificate(response.id, this.state.file)

        this.props.refreshCertificatesData()

    }

    setFile(file){
        this.setState({
            file:file[0]
        })
    }

    render(){
        return (
            <Fragment>
                <h3 className="card-title">Add Certificate Authority</h3>
                <div className="form-group">
                    <label htmlFor="label">Label : </label>
                    <input type='text' name="label" className="row form-control" onChange={this.handleChange} />
                    <Dropzone onDrop={acceptedFile => this.setFile(acceptedFile)} >
                        {({ getRootProps, getInputProps }) => (
                            <section>
                                <div className={this.state.inProgress ? "dropzone dz-parsing":"dropzone"} {...getRootProps()} >
                                    <input {...getInputProps()} />
                                    <p>{!!this.state.file ? this.state.file.name : "Drop Certificate file"}</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </div>
                <div className="text-right mb-5">
                    <input disabled={!this.state.file||!this.state.label}  type='button' className='row btn btn-primary' onClick={this.handleClick} value='send' />
                </div>
            </Fragment>
        )
    }
}
