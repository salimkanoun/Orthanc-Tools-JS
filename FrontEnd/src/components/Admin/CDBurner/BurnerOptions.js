import React, { Component } from 'react'
import Select from 'react-select'
import TranscodeSelector from '../../Export/TranscodeSelector'
import apis from '../../../services/apis'

export default class BurnerOptions extends Component{

    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    state = {
        burner_monitored_path : '',
        burner_viewer_path : '',
        burner_label_path : '',
        burner_manifacturer : '',
        burner_monitoring_level : '',
        burner_support_type : 'Auto',
        burner_delete_study_after_sent : false,
        burner_transfer_syntax : null

    }

    manufacturerOptions = [
        {value : 'Epson', label : 'Epson'},
        {value : 'Primera', label : 'Primera'}
    ]

    levelOptions = [
        {value: 'study', label : 'Study'},
        {value: 'patient', label: 'Patient'}
    ]
    
    supportType = [
        {value : 'Auto', label : 'Auto'},
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

    async componentDidMount(){
        let options = await apis.options.getOptions()
        this.setState( {
            ...options
        }, console.log(this.state))
        console.log(options)
    }

    render(){
        return (
            <div>
                <h2 className="card-title">CD/DVD Burner Options</h2>
                <label htmlFor="burner_monitored_path">Monitored Folder : </label>
                <input type = 'text'  className="row form-control" name='burner_monitored_path' value={this.state.burner_monitored_path} onChange={this.handleChange} placeholder="Example : C:\\myPath\Epson" />
                <label htmlFor="burner_viewer_path">Viewer Folder : </label>
                <input type = 'text'  className="row form-control" name='burner_viewer_path' value={this.state.burner_viewer_path} onChange={this.handleChange} placeholder="Example : C:\\myPath\Viewer" />
                <label htmlFor="burner_label_path">Label Path : </label>
                <input type = 'text'  className="row form-control" name='burner_label_path' value={this.state.burner_label_path} onChange={this.handleChange} placeholder="Example : C:\\myPath\label" />
                <label htmlFor="burner_transfer_syntax">Transfer Syntax : </label>
                <TranscodeSelector value={this.state.burner_transfer_syntax} name='burner_transfer_syntax'/>
                <label htmlFor="burner_manifacturer">Manufacturer : </label>
                <Select options={this.manufacturerOptions} value={this.state.burner_manifacturer} name="burner_manifacturer"/>
                <label htmlFor="burner_monitoring_level">Monitoring Level : </label>
                <Select options={this.levelOptions} value={this.state.burner_monitoring_level} name = "burner_monitoring_level" />
                <label htmlFor="burner_support_type">Support Type : </label>
                <Select options={this.supportType} value={this.state.burner_support_type} name = "burner_support_type" />
                <div className ="form-control mt-3" >
                    <label htmlFor="burner_delete_study_after_sent">Delete Original Images From Orthanc : </label>
                    <input type = "checkbox" value={this.state.burner_delete_study_after_sent} name="burner_delete_study_after_sent" value="Delete Original Study/Patient"/>
                </div>
            </div>
        )
    }

}