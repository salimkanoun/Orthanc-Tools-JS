import React, { Component } from 'react'
import TranscodeSelector from '../../Export/TranscodeSelector'

export default class BurnerOptions extends Component{

    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event){
        const target = event.target
        const name = target.name
        const value = target.type === 'checkbox' ? target.checked : target.value
        
        this.setState({
            [name]: value
        })
    
    }

    //Reste : Monitoring Level, Burner Manufacturer, Delete after send, Support Type

    render(){
        return (
            <div>
                 <h2 className="card-title">CD/DVD Burner Options</h2>
                <label htmlFor="monitoredFolder">Monitored Folder : </label>
                <input type = 'text'  className="row form-control" name='monitoredFolder' onChange={this.handleChange}/>
                <label htmlFor="viewerFolder">Viewer Folder : </label>
                <input type = 'text'  className="row form-control" name='viewerFolder' onChange={this.handleChange}/>
                <label htmlFor="labelPath">Label Path : </label>
                <input type = 'text'  className="row form-control" name='labelPath' onChange={this.handleChange}/>
                <label htmlFor="transcodeSelector">Transfer Syntax : </label>
                <TranscodeSelector name='transcodeSelector'/>

                
            </div>
        )
    }

}