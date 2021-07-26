import React, { Component, Fragment } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import apis from '../../../services/aets'

/**
 * Form to declare or modify an AET
 */
export default class AetForm extends Component {

    state = {
        name: '',
        aetName: '',
        ip: '',
        port: '',
        manufacturer: { value: 'Generic', label: 'Generic' }
    }

    manufacturers = [
        { value: 'Generic', label: 'Generic' },
        { value: 'GenericNoWildcardInDates', label: 'GenericNoWildcardInDates' },
        { value: 'GenericNoUniversalWildcard', label: 'GenericNoUniversalWildcard' },
        { value: 'Vitrea', label: 'Vitrea' },
        { value: 'GE', label: 'GE' }
    ]

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
     * Fill manufacturer select choice in current state
     * @param {*} item 
     */
    manufacturerChangeListener = (item) => {
        this.setState({
            manufacturer: item
        })
    }

    /**
     * Listener on form submission
     */
    handleClick = async () => {
        try {
            await apis.updateAet(this.state.name, this.state.aetName, this.state.ip, this.state.port, this.state.manufacturer.value)
            this.setState({
                name: '',
                aetName: '',
                ip: '',
                port: '',
                manufacturer: { value: 'Generic', label: 'Generic' }
            })
            this.props.refreshAetData()
        } catch (error) {
            toast.error(error.statusText)
        }

    }

    render = () => {
        return (
            <Fragment>
                <h2 className="text-center">New Aet</h2>
                <div className="form-group">
                    <label htmlFor="name">Name : </label>
                    <input type='text' name="name" value={this.state.name} className="form-control" onChange={this.handleChange} />
                    <label htmlFor="aetName">Aet Name : </label>
                    <input type='text' name="aetName" value={this.state.aetName} className="form-control" onChange={this.handleChange} />
                    <label htmlFor="ip">IP : </label>
                    <input type='text' name="ip" value={this.state.ip} className="form-control" onChange={this.handleChange} />
                    <label htmlFor="port">Port : </label>
                    <input type='number' min="0" max="999999" value={this.state.port} name="port" className="form-control" onChange={this.handleChange} />
                    <label htmlFor="manufacturer">Manufacturer : </label>
                    <Select className="col-sm" options={this.manufacturers} value={this.state.manufacturer} name="manufacturer" onChange={this.manufacturerChangeListener} />
                    <div className="text-center mt-3">
                        <input type='button' className='row btn btn-primary' onClick={this.handleClick} value='send' />
                    </div>
                </div>

            </Fragment>
        )
    }
}
