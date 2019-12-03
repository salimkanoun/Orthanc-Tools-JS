import React, { Component } from 'react'
import Select from 'react-select'

class ChosenSelect extends Component {

    options = [
        { value: 'CT', label: 'CT' },
        { value: 'PT', label: 'PT' },
        { value: 'NM', label: 'NM' },
        { value: 'MR', label: 'MR' },
        { value: 'US', label: 'US' },
        { value: 'MG', label: 'MG' }
      ]
      
    render = () => (
        <Select isMulti options={this.options} />
    )
}


export default ChosenSelect