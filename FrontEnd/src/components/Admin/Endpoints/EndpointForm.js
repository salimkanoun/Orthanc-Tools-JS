import React, { Component, Fragment } from 'react'
import Select from 'react-select'
import apis from '../../../services/apis'

/**
 * Form to declare or modify an Ssh Keys
 */
export default class EndpointForm extends Component {
    state = {
        keys:[]
    }

    protocols = [
        { value: 'sftp', label: 'Sftp'},
        { value: 'ftp', label: 'Ftps/Ftp'},
        { value: 'webdav', label: 'Webdav'}
    ]

    constructor(props) {
        super(props)
        this.handleChange=this.handleChange.bind(this)
        this.handleClick=this.handleClick.bind(this)
        this.loadKeys()
    }

    async loadKeys(){
        let sshKeys = []
        let response = await apis.sshKeys.getKeysExpend()
        response.forEach(key => {
            sshKeys.push({value:key.id, label:key.label})
        });
        this.setState({keys:sshKeys})
    }

    handleSelectChange(name){
        return ((value)=>{
            console.log(this)
            console.log(value)
            this.setState({
                [name]: value.value
            })
        }).bind(this)
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
        let postData = {}
        
        postData.protocol = this.state.protocol
        postData.label = this.state.label
        postData.host = this.state.host
        postData.port = this.state.port
        postData.username = this.state.username
        postData.password = this.state.password || null
        postData.targetFolder = this.state.targetFolder || ''
        if(this.state.protocol==='sftp'&&this.state.ssh){
            postData.sshKey = this.state.sshKey
        }else if(this.state.protocol==='ftp'){
            postData.ssl = this.state.ssl || false
        }else if(this.state.protocol==='webdav'){
            postData.digest = this.state.digest || false
        }
        
        await apis.endpoints.createEndpoint(postData)

        this.props.refreshEndpointsData()

    }

    readyToSummit(){
        let ready = (this.state.protocol)
        ready = ready && (this.state.label)
        ready = ready && (this.state.host)
        ready = ready && (this.state.port)
        ready = ready && (this.state.username)
        ready = ready && (this.state.sshKey || !(this.state.protocol==='sftp'&&this.state.ssh))
        
        return ready
    }

    render(){
        return (
            <Fragment>
                <h2 className="card-title">Add Export Endpoint</h2>
                <div className="form-group grid-form-group">
                    <label htmlFor="protocol">Protocol </label>
                    <Select classNamePrefix="select" name="protocol" single options={this.protocols} onChange={this.handleSelectChange('protocol')} value={this.protocols[this.state.protocol]}/>
                    <label htmlFor="label">Label : </label>
                    <input type='text' name="label" className="form-control" onChange={this.handleChange} />
                    <label htmlFor="host">Host : </label>
                    <input type='text' name="host" className="form-control" onChange={this.handleChange} />
                    <label htmlFor="port">Port : </label>
                    <input type='number' name="port" className="form-control" onChange={this.handleChange} />
                    <label htmlFor="username">Username : </label>
                    <input type='text' name="username" className="form-control" onChange={this.handleChange} />
                    {
                        this.state.protocol === 'sftp'?
                        <><label htmlFor="ssh" >Use a private key?</label>
                        <input type='checkbox' name="ssh" className="form-control" onChange={this.handleChange}/></>:
                        <></>
                    }
                    {
                        this.state.ssh&&this.state.protocol === 'sftp'?
                        <><label htmlFor="sshKey">Ssh Key : </label>
                        <Select classNamePrefix="select" name="sshKey" single options={this.state.keys} onChange={this.handleSelectChange('sshKey')} value={this.state.keys[this.state.sshKey]}/></>:
                        <><label htmlFor="password">Password : </label>
                        <input type='password' name="password" className="form-control" onChange={this.handleChange} /></>
                    }
                    <label htmlFor="targetFolder">Destination Folder : </label>
                    <input type='text' name="targetFolder" className="form-control" onChange={this.handleChange} />
                    {
                        this.state.protocol === 'ftp'?
                        <><label htmlFor="ssl">Use ssl?</label>
                        <input type='checkbox' name="ssl" className="form-control" onChange={this.handleChange} /></>:
                        <></>
                    }
                    {
                        this.state.protocol === 'webdav'?
                        <><label htmlFor="digest">Use digest?</label>
                        <input type='checkbox' name="digest" className="form-control" onChange={this.handleChange} /></>:
                        <></>
                    }
                </div>
                <div className="text-right mb-5">
                    <input disabled={!this.readyToSummit()}  type='button' className='row btn btn-primary' onClick={this.handleClick} value='send' />
                </div>
            </Fragment>
        )
    }
}
