import React, { useState } from 'react'

import Users from './local/Users'
import Roles from './roles/Roles'
import Ldap from './distant/Ldap'
import { Nav } from 'react-bootstrap'

export default () => {

    const [currentComponent, setCurrentComponent] = useState('Users')

    const getComponentToDisplay = () => {
        let component = null
        switch (currentComponent) {
            case 'Users':
                component = <Users />
                break
            case 'Roles':
                component = <Roles />
                break
            case 'Ldap':
                component = <Ldap />
                break
            default:
                break
        }

        return component
    }

    const switchTab = (tabName) => {
        setCurrentComponent(tabName)
    }


    return (
        <div>
            <Nav className="mb-5 me-auto" variant="pills" activeKey={currentComponent}>
                <Nav.Item eventKey={'Users'} onClick={() => switchTab('Users')} >Local Users</Nav.Item>
                <Nav.Item eventKey={'Roles'} onClick={() => switchTab('Roles')}>Roles</Nav.Item>
                <Nav.Item eventKey={'Ldap'} onClick={() => switchTab('Ldap')}> Distant Users</Nav.Item>
            </Nav>
            <div>
                {getComponentToDisplay()}
            </div>
        </div>
    )
}