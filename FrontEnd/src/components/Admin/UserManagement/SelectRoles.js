import React, { Component } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import apis from '../../../services/apis'


export default class SelectRoles extends Component {

    state = {
        optionRoles: {}
    }

    componentDidMount = async () => {
        try {
            let roles = await apis.role.getRoles()
            let options = []
            roles.forEach((role) => {
                options.push({
                    value: role.name,
                    label: role.name
                })
            })
            this.setState({
                optionRoles: options
            })

        } catch (error) {
            toast.error(error.statusText)
        }

    }

    render = () => {
        return (
            <Select single options={this.state.optionRoles} onChange={this.props.onChange} />
        )
    }

}