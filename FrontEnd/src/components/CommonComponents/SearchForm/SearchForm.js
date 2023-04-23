import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import Select from 'react-select'

import moment from 'moment'

import SelectModalities from './SelectModalities'
import AetButton from './AetButton'

/**
 * Abstract search form
 * need props :
 * title : title of the form
 * buttons : buttons to validate and treat the form 
 */
export default ({ icon , title, buttonsName, onFormValidate}) => {

    const [state, setState] = useState({
        firstName: '',
        lastName: '',
        patientID: '',
        accessionNumber: '',
        studyDescription: '',
        dateFrom: '',
        dateTo: '',
        modalities: '',
        presetDate: 'none'
    })

    const dates = [
        { value: 'none', label: 'None' },
        { value: 'today', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'lastWeek', label: 'Last Week' },
        { value: 'lastMonth', label: 'Last Month' },
        { value: 'last3Months', label: 'Last 3 months' },
        { value: 'lastYear', label: 'Last Year' }
    ]

    const getState = () => {
        return state
    }

    /**
     * Store modality string comming from SelectModalities component in the current state
     * @param {String} modalityString 
     */
    const updateModalities = (modalityString) => {
        setState((state) => ({
            ...state,
            ['modalities']: modalityString
        })
        )
    }

    /**
     * Fill input text of users in current state
     * @param {*} event 
     */
    const handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.value

        setState((state) => ({
            ...state,
            [name]: value
        })
        )
    }



    const changeListener = (event) => {
        setState((state) => ({
            ...state,
            ['presetDate']: event.value
        })
        )
        let dateFrom = ''
        let dateTo = moment().format('YYYY-MM-DD')
        switch (event.value) {
            case 'none':
                dateTo = ''
                break
            case 'today':
                dateFrom = moment().format('YYYY-MM-DD')
                break;
            case 'yesterday':
                dateFrom = moment().subtract(1, 'days').format("YYYY-MM-DD")
                break
            case 'lastWeek':
                dateFrom = moment().subtract(7, 'days').format('YYYY-MM-DD')
                break
            case 'lastMonth':
                dateFrom = moment().subtract(1, 'month').format('YYYY-MM-DD')
                break
            case 'last3Months':
                dateFrom = moment().subtract(3, 'months').format('YYYY-MM-DD')
                break
            case 'lastYear':
                dateFrom = moment().subtract(1, 'year').format('YYYY-MM-DD')
                break
            default:
                setState((state) => ({
                    ...state,
                    [dateFrom]: '',
                    [dateTo] : ''
                }))

                break
        }
        setState((state) => ({
            ...state,
            [dateFrom]: dateFrom,
            [dateTo] : dateTo
        }))
    }

    //form
        return (
            <div>
                <Row className="border-bottom border-2 pb-3">
                    <Col className="d-flex justify-content-start align-items-center">
                        <i className={icon + " ico me-3"}></i><h2 className="card-title">{title}</h2>
                    </Col>
                </Row>
                <div className='row mt-5'>
                    <div className='col-sm'>
                        <label htmlFor='lastName' className="form-label">Last Name</label>
                        <input type='text' name='lastName' id='lastName' className='form-control' placeholder='Last name' onChange={handleChange} value={state.lastName} />
                    </div>
                    <div className='col-sm'>
                        <label htmlFor='firstName' className="form-label">First Name</label>
                        <input type='text' name='firstName' id='firstName' className='form-control' placeholder='First name' onChange={handleChange} value={state.firstName} />
                    </div>
                    <div className='col-sm'>
                        <label htmlFor='patientID' className="form-label">Patient ID</label>
                        <input type='text' name='patientID' id='patientID' className='form-control' placeholder='Patient ID' onChange={handleChange} value={state.patientID} />
                    </div>
                </div>
                <div className='row mt-4'>
                    <div className='col-sm'>
                        <label htmlFor='accessionNumber' className="form-label">Accession Number</label>
                        <input type='text' name='accessionNumber' id='accessionNumber' className='form-control' placeholder='Accession Number' onChange={handleChange} value={state.accessionNumber} />
                    </div>
                    <div className='col-sm'>
                        <label htmlFor='studyDescription' className="form-label">Study Description</label>
                        <input type='text' name='studyDescription' id='studyDescription' className='form-control' placeholder='Study Description' onChange={handleChange} value={state.studyDescription} />
                    </div>
                    <div className='col-sm'>
                        <label htmlFor='modalities' className="form-label">Modalities</label>
                        <SelectModalities previousModalities={state.modalities} onChange={updateModalities} />
                    </div>
                </div>
                <div className='row mt-4'>
                    <div className='col-sm'>
                        <label htmlFor='date' className="form-label">Date Preset</label>
                        <Select name="dates" single options={dates} onChange={changeListener} />
                    </div>
                    <div className='col-sm'>
                        <label htmlFor='dateFrom' className="form-label">Date From</label>
                        <input type='date' name='dateFrom' id='dateFrom' className='form-control' placeholder='Date From' onChange={handleChange} value={state.dateFrom} disabled={state.presetDate !== 'none'} />
                    </div>
                    <div className='col-sm'>
                        <label htmlFor='dateTo' className="form-label">Date To</label>
                        <input type='date' name='dateTo' id='dateTo' className='form-control' placeholder='Date To' onChange={handleChange} value={state.dateTo} disabled={state.presetDate !== 'none'} />
                    </div>
                </div>
                <div className='mt-3 mb-3 text-center'>
                    <div>
                        {buttonsName.map((aet) => <AetButton
                            key={aet}
                            aetName={aet}
                            onClick={(event) => { onFormValidate(state, aet) }}
                        />)}
                    </div>
                </div>

            </div>
        )

}