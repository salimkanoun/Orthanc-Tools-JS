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
                    <ul className='nav nav-pills nav-fill'>
                        <li className='nav-item'>
                            <button className={this.state.currentComponent === 'Users' ? 'col nav-link active link-button' : ' col link-button'} onClick={() => this.switchTab('Users')}>Local Users</button>
                        </li>
                        <li className='nav-item'>
                            <button className={this.state.currentComponent === 'Roles' ? 'col nav-link active link-button' : 'col link-button'} onClick={() => this.switchTab('Roles')}>Roles</button>
                        </li>

                        <li className='nav-item'>
                            <button className={this.state.currentComponent === 'Ldap' ? 'col nav-link active link-button' : 'col link-button'} onClick={() => this.switchTab('Ldap')}>Distant Users</button>
                        </li>
                    </ul>
                </div>
                <div>
                    {this.getComponentToDisplay()}
                </div>
            </div>
        )
    }
}