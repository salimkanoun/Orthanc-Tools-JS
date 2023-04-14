import React, { useState } from 'react'

import Users from './local/Users'
import Roles from './roles/Roles'
import Ldap from './distant/Ldap'
import { Button } from 'react-bootstrap'

export default () => {

    const TAB_USERS = 'users'
    const TAB_ROLES = 'roles'
    const TAB_LDAP = 'ldap'

    const [currentComponent, setCurrentComponent] = useState(TAB_USERS)

    const getComponentToDisplay = () => {
        switch (currentComponent) {
            case TAB_USERS:
                return <Users />
            case TAB_ROLES:
                return <Roles />
            case TAB_LDAP:
                return <Ldap />
            default:
                break
        }
    }

    return (
        <div>
            <div className='mb-5'>
                <nav className="otjs-navmenu container-fluid">
                    <div className="otjs-navmenu-nav">
                        <li className='col-4 text-center'>
                            <Button
                                className={currentComponent === TAB_USERS ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentComponent(TAB_USERS)}>Local Users
                            </Button>
                        </li>
                        <li className='col-4 text-center'>
                            <Button
                                className={currentComponent === TAB_ROLES ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentComponent(TAB_ROLES)}>Roles
                            </Button>
                        </li>
                        <li className='col-4 text-center'>
                            <Button
                                className={currentComponent === TAB_LDAP ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentComponent(TAB_LDAP)}>Roles
                            </Button>
                        </li>
                    </div>
                </nav>
            </div>
            <div>
                {getComponentToDisplay()}
            </div>
        </div>
    )
}