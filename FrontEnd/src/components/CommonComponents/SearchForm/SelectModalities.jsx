import React, { useEffect, useState } from 'react'
import Select from 'react-select/creatable'

/**
 * Component for a Select modality input
 * Used in manual and AutoQuery
 */
export default ({ previousModalities, onChange }) => {

  const [selectedModalities, setSelectedModalities] = useState([])

  const modalitiesRadiology = [
    { value: 'CT', label: 'CT', explanation: 'Computed Tomography' },
    { value: 'DX', label: 'DX', explanation: 'Digital Radiography' },
    { value: 'CR', label: 'CR', explanation: 'Computed Radiography' },
    { value: 'MR', label: 'MR', explanation: 'Magnetic Resonance' },
    { value: 'US', label: 'US', explanation: 'Ultrasound' },
    { value: 'MG', label: 'MG', explanation: 'Mammography' },
    { value: 'XA', label: 'XA', explanation: 'X-Ray Angiography' }
  ]

  const modalitiesNuclearMedicine = [
    { value: 'PT', label: 'PT', explanation: 'Positron emission tomography' },
    { value: 'NM', label: 'NM', explanation: 'Nuclear Medicine' }
  ]

  const modalitiesRadiotherapy = [
    { value: 'RTDOSE', label: 'RTDOSE', explanation: 'Radiotherapy Dose' },
    { value: 'RTIMAGE', label: 'RTIMAGE', explanation: 'Radiotherapy Image' },
    { value: 'RTPLAN', label: 'RTPLAN', explanation: 'Radiotherapy Plan' },
    { value: 'RTRECORD', label: 'RTRECORD', explanation: 'RT Treatment Record' },
    { value: 'RTSTRUCT', label: 'RTSTRUCT', explanation: 'Radiotherapy Structure Set' },
    { value: 'SEG', label: 'SEG', explanation: 'Segmentation' },
  ]

  const groupStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  const groupBadgeStyles = {
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

  const groupedOptions = [
    {
      label: 'Radiology',
      options: modalitiesRadiology,
    },
    {
      label: 'NuclearMedicine',
      options: modalitiesNuclearMedicine,
    },
    {
      label: 'Radiotherapy',
      options: modalitiesRadiotherapy,
    },
  ]

  const formatOptionLabel = ({ value, label, explanation }) => (
    <div style={{ display: "flex" }}>
      <div>{label}</div>
      <div style={{ marginLeft: "10px", color: "#ccc" }}>
        {explanation}
      </div>
    </div>
  );

  const formatGroupLabel = data => (
    <div style={groupStyles}>
      <span> {data.label} </span>
      <span> {data.details} </span>
    </div>
  );

  useEffect(() => {
    //If we recieve a previous modality input in props, load it in the state
    if (previousModalities !== "") {
      let previousModalityArray = previousModalities.split('\\').map((modality) => {
        return { value: modality, label: modality }
      })
      setSelectedModalities(previousModalityArray)
    }
  }, [])



  /**
   * Fill user choice in the state
   * @param {*} value 
   */
  const changeListener = (value) => {
    if (value === null) value = []
    setSelectedModalities(value)
  }

  /**
   * On exiting component (on blur), return the string value of modalities
   */
  const saveListener = () => {
    onChange(getValue());
  }

  /**
   * Return modality String to be used in Orthanc API query parameters
   */
  const getValue = () => {
    let modalityArray = selectedModalities.map((modalitiesObject) => {
      return modalitiesObject.value;
    });

    let modalityString = ''
    if (modalityArray.length > 0) modalityString = modalityArray.join('\\')

    return modalityString;
  }

  return (
    <Select isMulti menuPosition="fixed" options={groupedOptions}
      formatOptionLabel={formatOptionLabel}
      value={selectedModalities}
      onBlur={saveListener}
      onChange={changeListener}
      formatGroupLabel={formatGroupLabel}
    />
  )

}