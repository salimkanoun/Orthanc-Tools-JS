import React, { Component } from 'react'
import { connect } from "react-redux"
import { Row, Col } from 'react-bootstrap'
import Select from 'react-select'

import { saveProfile } from '../../actions/AnonList'

class AnonProfile extends Component {

    option = [
        { value: 'Default', label: 'Default' },
        { value: 'Full', label: 'Full' }
    ]

    getProfileSelected = () => {
        let index = -1
        this.option.forEach(element => {
            if (element.value === this.props.profile) {
                index = this.option.indexOf(element)
            }
        })
        return this.option[index]
    }

    render = () => {
        return (
            <Row className="align-items-center text-center">
                <Col sm={3}>
                    <label htmlFor='profile'>Anon Profile : </label>
                </Col>
                <Col sm={9}>
                    <Select name='profile' single options={this.option} onChange={(e) => this.props.saveProfile(e.value)} placeholder='Profile' value={this.getProfileSelected()} />
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = state => {
    return {
        profile: state.AnonList.profile
    }
}

const mapDispatchToProps = {
    saveProfile
}

export default connect(mapStateToProps, mapDispatchToProps)(AnonProfile)