import React, { useState } from 'react'

import Users from './Users'
import Roles from './Roles'
import Ldap from './Ldap'
import { Button } from 'react-bootstrap'

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
            <div className='mb-5'>
                <nav className="otjs-navmenu container-fluid">
                    <div className="otjs-navmenu-nav">
                        <li className='col-3 text-center'>
                            <Button className={currentComponent === 'Users' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => switchTab('Users')}>Local Users
                            </Button>
                        </li>
                        <li className='col-4 text-center'>
                            <Button className={currentComponent === 'Roles' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => switchTab('Roles')}>Roles
                            </Button>
                        </li>
                        <li className='col-4 text-center'>
                            <Button className={currentComponent === 'Ldap' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => switchTab('Ldap')}>Distant Users
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