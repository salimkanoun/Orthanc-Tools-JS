import React, { Component } from 'react'
import { connect } from "react-redux"

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
            <div className='row'>
                <div className="col-auto" >
                    <label htmlFor='profile'>Anon Profile : </label>
                </div>
                <div className="col-md" >
                    <Select name='profile' single options={this.option} onChange={(e) => this.props.saveProfile(e.value)} placeholder='Profile' value={this.getProfileSelected()} />
                </div>
            </div>
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