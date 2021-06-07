import React, { Component } from 'react'
import Select from 'react-select/creatable'

/**
 * Component for a Select modality input
 * Used in manual and AutoQuery
 */
export default class SelectModalities extends Component {

  state = {
    selectedModalities: []
  }

  modalitiesRadiology = [
    { value: 'CT', label: 'CT', explanation: 'Computed Tomography' },
    { value: 'DX', label: 'DX', explanation: 'Digital Radiography' },
    { value: 'CR', label: 'CR', explanation: 'Computed Radiography' },
    { value: 'MR', label: 'MR', explanation: 'Magnetic Resonance' },
    { value: 'US', label: 'US', explanation: 'Ultrasound' },
    { value: 'MG', label: 'MG', explanation: 'Mammography' },
    { value: 'XA', label: 'XA', explanation: 'X-Ray Angiography' }
  ]

  modalitiesNuclearMedicine = [
    { value: 'PT', label: 'PT', explanation: 'Positron emission tomography' },
    { value: 'NM', label: 'NM', explanation: 'Nuclear Medicine' }
  ]

  modalitiesRadiotherapy = [
    { value: 'RTDOSE', label: 'RTDOSE', explanation: 'Radiotherapy Dose' },
    { value: 'RTIMAGE', label: 'RTIMAGE', explanation: 'Radiotherapy Image' },
    { value: 'RTPLAN', label: 'RTPLAN', explanation: 'Radiotherapy Plan' },
    { value: 'RTRECORD', label: 'RTRECORD', explanation: 'RT Treatment Record' },
    { value: 'RTSTRUCT', label: 'RTSTRUCT', explanation: 'Radiotherapy Structure Set' },
    { value: 'SEG', label: 'SEG', explanation: 'Segmentation' },
  ]

  groupStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  groupBadgeStyles = {
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: '1',
    minWidth: 1,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center',
  }

  groupedOptions = [
    {
      label: 'Radiology',
      options: this.modalitiesRadiology,
    },
    {
      label: 'NuclearMedicine',
      options: this.modalitiesNuclearMedicine,
    },
    {
      label: 'Radiotherapy',
      options: this.modalitiesRadiotherapy,
    },
  ]

  formatOptionLabel = ({ value, label, explanation }) => (
    <div style={{ display: "flex" }}>
      <div>{label}</div>
      <div style={{ marginLeft: "10px", color: "#ccc" }}>
        {explanation}
      </div>
    </div>
  );

  formatGroupLabel = data => (
    <div style={this.groupStyles}>
      <span> {data.label} </span>
      <span> {data.details} </span>
    </div>
  );


  componentDidMount = () => {
    //If we recieve a previous modality input in props, load it in the state
    if (this.props.previousModalities !== "") {
      let previousModalityArray = this.props.previousModalities.split('\\').map((modality) => {
        return { value: modality, label: modality }
      })

      this.setState({
        selectedModalities: previousModalityArray
      })
    }

  }

  /**
   * Fill user choice in the state
   * @param {*} value 
   */
  changeListener = (value) => {
    if (value === null) value = []
    this.setState({
      selectedModalities: value
    })
  }

  /**
   * On exiting component (on blur), return the string value of modalities
   */
  saveListener = () => {
    this.props.onUpdate(this.getValue());
  }

  render = () => {
    return (
        <Select isMulti menuPosition="fixed" options={this.groupedOptions}
          formatOptionLabel={this.formatOptionLabel}
          value={this.state.selectedModalities}
          onBlur={this.saveListener}
          onChange={this.changeListener}
          formatGroupLabel={this.formatGroupLabel}
        />
    )
  }

  /**
   * Return modality String to be used in Orthanc API query parameters
   */
  getValue = () => {
    let modalityArray = this.state.selectedModalities.map((modalitiesObject) => {
      return modalitiesObject.value;
    });

    let modalityString = ''
    if (modalityArray.length > 0) modalityString = modalityArray.join('\\')

    return modalityString;
  }

}