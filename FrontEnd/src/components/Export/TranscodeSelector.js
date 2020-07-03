import React, { Component } from 'react'
import Select from 'react-select'

import apis from '../../services/apis'


class TranscodeSelector extends Component {

    state = {
        TS: {}
    }

    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
        const TS = apis.localStorage.getLocalStorage('TS')
        let value = {}
        if(TS !== null){
            this.options.forEach((option) => {
                if (option.value === TS){
                    value = option
                }
            })
            this.setState({
                TS: value
            })
        } else {
            this.setState({
                TS: this.options[0]
            })
            apis.localStorage.setlocalStorage('TS', this.options[0].value)
        }
    }

    handleChange(value){
        this.setState({
            TS: value
        })
        apis.localStorage.setlocalStorage('TS', value.value)
    }
    

    options = [
        {value: 'none',                     label: 'None'},
        {value: '1.2.840.10008.1.2',        label: 'Implicit VR Endian'},
        {value: '1.2.840.10008.1.2.1',      label: 'Explicit VR Little Endian'},
        {value: '1.2.840.10008.1.2.1',      label: 'Deflated Explicit VR Little Endian'},
        {value: '1.2.840.10008.1.2.2',      label: 'Explicit VR Big Endian'},
        {value: '1.2.840.10008.1.2.4.50',   label: 'JPEG 8-bit'},
        {value: '1.2.840.10008.1.2.4.51',   label: 'JPEG 12-bit'},
        {value: '1.2.840.10008.1.2.4.57',   label: 'JPEG Lossless'},
        {value: '1.2.840.10008.1.2.4.70',   label: 'JPEG Lossless'},
        {value: '1.2.840.10008.1.2.4.80',   label: 'JPEG-LS Lossless' },
        {value: '1.2.840.10008.1.2.4.81',   label: 'JPEG-LS Lossy'},
        {value: '1.2.840.10008.1.2.4.90',   label: 'JPEG 2000 (90)'},
        {value: '1.2.840.10008.1.2.4.91',   label: 'JPEG 2000 (91)'},
        {value: '1.2.840.10008.1.2.4.92',   label: 'JPEG 2000 (92)'},
        {value: '1.2.840.10008.1.2.4.93',   label: 'JPEG 2000 (93)'}

    ]


    render() {
        return (
            <Select className='mt-2' name="ts" single options={this.options} onChange={this.handleChange} value={this.state.TS}/>
        );
    }
}

export default TranscodeSelector;