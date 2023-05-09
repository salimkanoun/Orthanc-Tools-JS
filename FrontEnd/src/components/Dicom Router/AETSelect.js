import Select from 'react-select';
import { useEffect, useState } from 'react';

import apis from "../../services/apis";

/**
 * To use it to edit AETs choice, pass an Array of AETs Name through the props named 'aets'
 */
export default ({ refresh }) => {

  const [selected, setSelected] = useState([])
  const [options, setOptions] = useState([])

  useEffect(() => {
    const getAets = async () => {await apis.aets.getAets()}
    let aets = getAets()
    for (var i = 0; i < aets.length; i++) {
      aets[i] = { value: aets[i], label: aets[i] }
    }
    if (aets) { //added for making this select bar available for modify destinations
      let selected = []
      let aets = aets || []
      for (let i = 0; i < aets.length; i++) {
        selected.push({ value: aets[i], label: aets[i] })
      }
      setSelected(selected)
    }
    setOptions(aets)
  }, [])


  /**
   * When the value of the selector change
   * @param {Array.<JSON>} value new value of the selected array
   */
  const handleOnChange = async (value) => {

    var selected = selected
    var difference = []
    if (value.length < selected.length) {
      for (let i = 0; i < selected.length; i++) {
        if (!(value.includes(selected[i]))) {
          difference.push(selected[i])
        }
      }
    }
    else if (value.length > selected.length) {
      for (let i = 0; i < value.length; i++) {
        if (!(selected.includes(value[i]))) {
          difference.push(value[i])
        }
      }
    } else {
      console.error('Selector Change Error : Selected Values didn\'t change')
    }
    refresh(value)
    setSelected(value)
  }

  const choiceStyle = {
    control: styles => ({ ...styles, backgroundColor: 'white' }),
    multiValue: (styles) => {
      return {
        ...styles,
      };
    },
    multiValueLabel: (styles) => ({
      ...styles,
    }),
    multiValueRemove: (styles => ({
      ...styles,
    }))
  };

  return (
    <div>
      <Select
        closeMenuOnSelect={false}
        isMulti
        options={options}
        onChange={handleOnChange.bind(this)}
        value={selected}
        style={choiceStyle}
      />
    </div>
  );
}