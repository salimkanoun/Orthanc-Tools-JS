import React, { Component, Fragment } from 'react'
import Select from 'react-select'

export default class AetForm extends Component {

    constructor(props) {
        super(props)
        this.handleChange=this.handleChange.bind(this)
        this.handleClick=this.handleClick.bind(this)
        this.manufacturerChangeListener=this.manufacturerChangeListener.bind(this)
    }

    manufacturers= [
        { value: 'Generic', label: 'Generic' },
        { value: 'GenericNoWildcardInDates', label: 'GenericNoWildcardInDates' },
        { value: 'StoreScp', label: 'StoreScp' },
        { value: 'ClearCanvas', label: 'ClearCanvas' },
        { value: 'Dcm4Chee', label: 'Dcm4Chee' },
        { value: 'Vitrea', label: 'Vitrea' },
        { value: 'GE', label: 'GE' }
    ]

    handleChange(event) {
        const target = event.target
        const name = target.name
        const value = target.type === 'checkbox' ? target.checked : target.value
        
        this.setState({
            [name]: value
        })

    }

    manufacturerChangeListener(item){
        this.setState({
          manufacturer : item.value
        })
    }

    async handleClick() {

        let postString = JSON.stringify({ name: this.state.name, 
                                        aetName: this.state.aetName,
                                        ip : this.state.ip,
                                        port : this.state.port,
                                        manufacturer : this.state.manufacturer })

        await fetch("/api/aets", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: postString
        })

        this.props.refreshAetData()

    }

    render() {
        return (
            <Fragment>
                <div className="form-group">
                    <h2 className="card-title">Add Aet</h2>
                    <label htmlFor="name">Name : </label>
                    <input type='text' name="name" className="row form-control" onChange={this.handleChange} />
                    <label htmlFor="aetName">Aet Name : </label>
                    <input type='text' name="aetName" className="row form-control" onChange={this.handleChange} />
                    <label htmlFor="ip">IP : </label>
                    <input type='text' name="ip" className="row form-control" onChange={this.handleChange} />
                    <label htmlFor="port">Port : </label>
                    <input type='number' min="0" max="999999" name="port" className="row form-control" onChange={this.handleChange} />
                    <label htmlFor="manufacturer">Manufacturer : </label>
                    <Select options={this.manufacturers} name="manufacturer" onChange={this.manufacturerChangeListener}/>
                    
                </div>
                <div className="text-right mb-5">
                <input type='button' className='row btn btn-primary' onClick={this.handleClick} value='send' />
                </div>
            </Fragment>
        )
    }
}
