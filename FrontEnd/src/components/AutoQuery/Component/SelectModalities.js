import React, { Component } from 'react'
import Select from 'react-select'

export default class SelectModalities extends Component {

    state = {
      selectedModalities : []
    }

    modalities= [
      { value: 'CT', label: 'CT' },
      { value: 'PT', label: 'PT' },
      { value: 'NM', label: 'NM' },
      { value: 'MR', label: 'MR' },
      { value: 'US', label: 'US' },
      { value: 'MG', label: 'MG' }
    ]

    constructor(props){
      super(props)
      this.saveListener = this.saveListener.bind(this)
      this.changeListener= this.changeListener.bind(this);
    }

    componentDidMount(){
      //If we recieve a previous modality input, load it in the state
      if(this.props.previousModalities !== ""){
        let previousModalityArray = this.props.previousModalities.split('/').map( (modality)=> {
            return { value: modality, label: modality }
        })

        this.setState({
          selectedModalities : previousModalityArray
        })
      }

    }

    /**
     * Fill user choice in the state
     * @param {*} value 
     */
    changeListener(value){
      this.setState({
        selectedModalities : value
      })
    }

    /**
     * On exiting component (on blur), return the string value of modalities
     */
    saveListener(){
      let modalityString = this.getValue()
      this.props.onUpdate(modalityString);
    }

    render() {
      return (
        <Select isMulti options={this.modalities} 
          value = { this.state.selectedModalities } 
          onBlur={this.saveListener} 
          onChange={this.changeListener}
          />
      )
    }

    /**
     * Return modality String to be used in Orthanc API query parameters
     */
    getValue() {
      let modalityArray = this.state.selectedModalities.map( (modalitiesObject) => {
        return modalitiesObject.value;
      });

      let modalityString= ''
      if(modalityArray.length > 0) modalityString = modalityArray.join('/')

      return modalityString;
    }
    
}