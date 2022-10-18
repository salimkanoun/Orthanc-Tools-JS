import React, { Component, useState } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import apis from '../../../services/apis'


export default ({onChange}) => {

    const [optionRoles, setOptionRoles] = useState({})


    const componentDidMount = async () => {
        try {
            let roles = await apis.role.getRoles()
            let options = []
            roles.forEach((role) => {
                options.push({
                    value: role.name,
                    label: role.name
                })
            })
            setOptionRoles(options)

        } catch (error) {
            toast.error(error.statusText)
        }

    }


        return (
            <Select single options={optionRoles} onChange={onChange} />
        )

}