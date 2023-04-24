import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Row, Col } from 'react-bootstrap'
import Select from 'react-select'
import { saveProfile } from '../../../actions/AnonList'

export default () => {

    const store = useSelector(state => {
        return {
            profile: state.AnonList.profile
        }
    })

    const dispatch = useDispatch()


    const option = [
        { value: 'Default', label: 'Default' },
        { value: 'Full', label: 'Full' }
    ]

    const getProfileSelected = () => {
        let index = -1
        option.forEach(element => {
            if (element.value === store.profile) {
                index = option.indexOf(element)
            }
        })
        return option[index]
    }

    return (
        <Row className="align-items-center text-center">
            <Col sm={3}>
                <label htmlFor='profile'>Anon Profile : </label>
            </Col>
            <Col sm={9}>
                <Select name='profile' single options={option} onChange={(e) => dispatch(saveProfile(e.value))} placeholder='Profile' value={getProfileSelected()} />
            </Col>
        </Row>
    );

}
