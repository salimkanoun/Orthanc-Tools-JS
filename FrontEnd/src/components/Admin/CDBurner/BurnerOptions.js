import React, { Component } from 'react'
import Select from 'react-select'
import TranscodeSelector from '../../Export/TranscodeSelector'

export default class BurnerOptions extends Component{

    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    manufacturerOptions = [
        {value : 'epson', label : 'Epson'},
        {value : 'primera', label : 'Primera'}
    ]

    levelOptions = [
        {value: 'study', label : 'Study'},
        {value: 'patient', label: 'Patient'}
    ]
    
    supportType = [
        {value : 'auto', label : 'Auto'},
        {value : 'CD', label : 'CD'},
        {value : 'DVD', label : 'DVD'}
    ]

    handleChange(event){
        const target = event.target
        const name = target.name
        const value = target.type === 'checkbox' ? target.checked : target.value
        
        this.setState({
            [name]: value
        })
    
    }

    render(){
        return (
            <div>
                <h2 className="card-title">CD/DVD Burner Options</h2>
                <label htmlFor="monitoredFolder">Monitored Folder : </label>
                <input type = 'text'  className="row form-control" name='monitoredFolder' onChange={this.handleChange} placeholder="Example : C:\\myPath\Epson" />
                <label htmlFor="viewerFolder">Viewer Folder : </label>
                <input type = 'text'  className="row form-control" name='viewerFolder' onChange={this.handleChange} placeholder="Example : C:\\myPath\Viewer" />
                <label htmlFor="labelPath">Label Path : </label>
                <input type = 'text'  className="row form-control" name='labelPath' onChange={this.handleChange} placeholder="Example : C:\\myPath\label" />
                <label htmlFor="transcodeSelector">Transfer Syntax : </label>
                <TranscodeSelector name='transcodeSelector'/>
                <label htmlFor="manufacturer">Manufacturer : </label>
                <Select options={this.manufacturerOptions} name="manufacturer"/>
                <label htmlFor="monitoringLevel">Monitoring Level : </label>
                <Select options={this.levelOptions} name = "monitoringLevel" />
                <label htmlFor="supportType">Support Type : </label>
                <Select options={this.supportType} name = "supportType" />
                <div className ="form-control" >
                    <label htmlFor="deleteOriginal">Delete Original : </label>
                    <input type = "checkbox"  name="deleteOriginal" value="Delete Original Study/Patient"/>
                </div>
            </div>
        )
    }

}