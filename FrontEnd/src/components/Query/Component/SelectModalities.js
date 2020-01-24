import React, { Component } from 'react'
import Select from 'react-select'

class SelectModalities extends Component {

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
      this.state = {
        selectedModalities : []
      }
    }

    changeListener(value){
      //Ajouter au state les valeurs selectionnées
      this.setState({
        ...this.state,
        selectedModalities : value
      })

    }

    saveListener(){
      let modalityString = this.getValue()
      this.props.onUpdate(modalityString);
    }

    render() {
      let valueArray=[];
      if(this.state === null && this.props.value.length >0 ){
        valueArray = this.props.value.split('/').map( (modality)=> {
            return { value: modality, label: modality }
        })

      }else if (this.state !== null){
        valueArray = this.state.selectedModalities

      }
      
      console.log(valueArray)
        return (
          <Select isMulti options={this.modalities} value = { valueArray } onBlur={this.saveListener} onChange={this.changeListener}/>
        )
    }

    getValue() {
      let modalityArray = this.state.selectedModalities.map((modalitiesObject)=>{
        return modalitiesObject.value;
      });
      let modalityString= modalityArray.join('/')
      return modalityString;
    }
}

export default SelectModalities;