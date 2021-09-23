import React, { Component } from 'react'

import Users from './Users'
import Roles from './Roles'
import Ldap from './Ldap'

export default class UserManagement extends Component {

    state = {
        currentComponent: 'Users'
    }

    getComponentToDisplay = () => {
        let component = null
        switch (this.state.currentComponent) {
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

    switchTab = (tabName) => {
        this.setState({
            currentComponent: tabName
        })
    }

    render = () => {
        return (
            <div>
                <div className='mb-5'>
                    <nav className="otjs-navmenu container-fluid">
                        <div className="otjs-navmenu-nav">
                            <li className='col-3 text-center'>
                                <button className={this.state.currentComponent === 'Users' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => this.switchTab('Users')}>Local Users</button>
                            </li>
                            <li className='col-4 text-center'>
                                <button className={this.state.currentComponent === 'Roles' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => this.switchTab('Roles')}>Roles</button>
                            </li>
                            <li className='col-4 text-center'>
                                <button className={this.state.currentComponent === 'Ldap' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => this.switchTab('Ldap')}>Distant Users</button>
                            </li>

                        </div>
                    </nav>
                </div>
                <div>
                    {this.getComponentToDisplay()}
                </div>
            </div>
        )
    }
}