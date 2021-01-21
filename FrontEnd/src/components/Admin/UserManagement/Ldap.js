import React, { Component, Fragment } from "react"
import Toggle from 'react-toggle'
import apis from "../../../services/apis"
import BootstrapTable from 'react-bootstrap-table-next';
import Select from 'react-select'
import ReactTooltip from "react-tooltip";
import HelpIcon from '@material-ui/icons/HelpSharp';
import CreateMatch from "./CreateMatch";
import { toast } from "react-toastify";

export default class Ldap extends Component {

    state = {
        check: false,
        LDAPport: 389,
        DN: '',
        password: '',
        address: '',
        changeType: { value: 'ad', label: 'Active Directory' },
        protocol: '',
        matches: [],
        base: '',
        group: '',
        user: ''
    }

    optionsTypeGroup = [
        { value: 'ad', label: 'Active Directory' },
        { value: 'ldap', label: 'LDAP' }
    ]

    setLdapSetting = () => {

        apis.ldap.setLdapSettings(this.state.changeType.value,
            this.state.address,
            this.state.LDAPport,
            this.state.DN,
            this.state.password,
            this.state.protocol,
            this.state.base,
            this.state.group,
            this.state.user)
            .then(() => { toast.success('LDAP Settings updated') })
            .catch((error) => { toast.error(error.statusText) })
    }

    testLdapSettings = () => {

        apis.ldap.testLdapSettings().then(answer => {
            if (answer) {
                toast.success('Connexion established')
            } else {
                toast.error('connexion failed')
            }
        }).catch((error) => {
            toast.error(error.statusText)
        })
    }

    componentDidMount = async () => {
        this.getMatches()

        let value, options

        try {
            //Mode
            value = await apis.options.getMode()
            //Ldap
            options = await apis.ldap.getLdapSettings()
        } catch (error) {
            toast.error(error.statusText)
            return
        }


        let typeGroup
        if (options.TypeGroupe === 'ad') {
            typeGroup = { value: 'ad', label: 'Active Directory' }
        } else if (options.TypeGroupe === 'ldap') {
            typeGroup = { value: 'ldap', label: 'LDAP' }
        } else {
            typeGroup = { value: '', label: '' }
        }

        this.setState({
            check: value,
            protocol: options.protocoles,
            changeType: typeGroup,
            LDAPport: options.port,
            DN: options.DN,
            password: options.mdp,
            group: options.groupe,
            user: options.user,
            base: options.base
        })

    }

    changeMode = async () => {
        try {
            await apis.options.changeMode(!this.state.check)
            this.setState(prevState => ({ check: !prevState.check }))
        } catch (error) {
            toast.error(error.statusText)
        }
    }

    handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.value

        this.setState({
            [name]: value
        })
    }

    changeListener = (event) => {
        this.setState({ changeType: event })
    }

    delete = (groupName) => {
        apis.ldap.deleteMatch(groupName).then(() => {
            toast.success('Match deleted with success')
            this.getMatches()
        }).catch(error => {
            toast.error(error.statusText)
        })
    }

    getMatches = async () => {
        try {
            let answer = await apis.ldap.getAllCorrespodences()
            this.setState({
                matches: answer
            })
        } catch (error) {
            toast.error(error.statusText)
        }

    }

    columns = [
        {
            dataField: 'groupName',
            text: 'Group name',
            sort: true
        }, {
            dataField: 'associedRole',
            text: 'Associed role',
        }, {
            dataField: 'delete',
            text: 'Delete',
            editable: false,
            formatExtraData: this,
            formatter: (cell, row, index, parentComponent) => {
                return <button type='button' name='delete' className='btn btn-danger' onClick={() => { parentComponent.delete(row.groupName) }} >Delete</button>
            }
        }
    ]

    render = () => {
        return (
            <Fragment>
                <h2 className='card-title'>Distant Users</h2>
                <div>
                    <div className="row mt-5 mb-3">
                        <div className='col-auto'>
                            <h5>LDAP/AD connexion</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.check} onChange={this.changeMode} />
                        </div>
                    </div>
                    <div className="form-group mr-3">
                        <div className="row">
                            <div className="col-sm">
                                <label htmlFor="typeGroup">Connexion type : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info1' fontSize="small" color="action" />
                                <ReactTooltip place="right" effect="solid" id='info1' type='dark'>
                                    <span>Choix du type de connexion (en fonction de la nature de votre annuaire): </span>
                                    <br></br>
                                    <span>1. Active Directory (Microsft's software)</span>
                                    <br></br>
                                    <span>2. Ldap (Open Souce Softaware)</span>
                                </ReactTooltip>
                                <Select name="typeGroup" isDisabled={!this.state.check} controlShouldRenderValue={true} closeMenuOnSelect={true} single options={this.optionsTypeGroup} onChange={this.changeListener} value={this.state.changeType} />
                            </div>
                            <div className="col-sm"></div>
                        </div>
                        <div className="row mt-2">
                            <div className='col-sm'>
                                <label htmlFor="protocol">Protocol : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info2' fontSize="small" color="action" />
                                <ReactTooltip place="right" effect="solid" id='info2' type='dark'>
                                    <span><i>ldap//:</i> no secure connexion </span>
                                    <br></br>
                                    <span><i>ldaps//:</i> secure connexion </span>
                                </ReactTooltip>
                                <input type='text' disabled={!this.state.check} name="protocol" className="form-control" onChange={this.handleChange} value={this.state.protocol} placeholder="ldap(s)://" />
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="address">Address : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info3' fontSize="small" color="action" />
                                <ReactTooltip place="right" effect="solid" id='info3' type='dark'>
                                    <span>Domain name or IP of the online directory</span>
                                    <br></br>
                                    <span>example : <i>127.0.0.1</i> or <i>chu.exemple.fr</i></span>
                                </ReactTooltip>
                                <input type='text' disabled={!this.state.check} name="address" className="form-control" onChange={this.handleChange} value={this.state.address} />
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="LDAPPort">Port : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info4' fontSize="small" color="action" />
                                <ReactTooltip place="right" effect="solid" id='info4' type='dark'>
                                    <span><i>389</i> no secure connexion </span>
                                    <br></br>
                                    <span><i>636</i> secure connexion </span>
                                </ReactTooltip>
                                <input type='number' disabled={!this.state.check} min='0' max='1000' name='LDAPport' id='LDAPport' className='form-control' onChange={this.handleChange} value={this.state.LDAPport} />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className='col-sm'>
                                <label htmlFor="base" >Base DN : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info9' fontSize="small" color="action" />
                                <ReactTooltip place="right" effect="solid" id='info9' type='dark'>
                                    <span>Base DN of the directoy from witch connexion will be established</span>
                                    <br></br>
                                    <span>example : <i>dc=chu,dc=exemple,dc=fr</i></span>
                                </ReactTooltip>
                                <input type='text' disabled={!this.state.check} name="base" className="form-control" value={this.state.base} onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="row mt-5">
                            <div className='col-sm'>
                                <label htmlFor="DN" >Bind DN :</label>
                                <HelpIcon className="ml-1" data-tip data-for='info5' fontSize="small" color="action" />
                                <ReactTooltip place="right" effect="solid" id='info5' type='dark'>
                                    <span>DN from witch user researchs will be made</span>
                                </ReactTooltip>
                                <input type='text' disabled={!this.state.check} name="DN" className="form-control" value={this.state.DN} onChange={this.handleChange} />
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="password">Bind DN password : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info6' fontSize="small" color="action" />
                                <ReactTooltip place="right" effect="solid" id='info6' type='dark'>
                                    <span>Password of the user from witch researchs will be made</span>
                                </ReactTooltip>
                                <input type='password' disabled={!this.state.check} name="password" className="form-control" value={this.state.password} onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="row mt-5">
                            <div className='col-sm'>
                                <label htmlFor="group">Group Filter : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info7' fontSize="small" color="action" />
                                <ReactTooltip place="right" effect="solid" id='info7' type='dark'>
                                    <span>DN for groups researchs</span>
                                </ReactTooltip>
                                <input type='text' disabled={!this.state.check} name="group" className="form-control" onChange={this.handleChange} value={this.state.group} />
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="user">User filter </label>
                                <HelpIcon className="ml-1" data-tip data-for='info8' fontSize="small" color="action" />
                                <ReactTooltip place="right" effect="solid" id='info8' type='dark'>
                                    <span>DN for users researchs</span>
                                </ReactTooltip>
                                <input type='text' disabled={!this.state.check} name="user" className="form-control" onChange={this.handleChange} value={this.state.user} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group text-right mr-2">
                        <input type='button' disabled={!this.state.check} className='btn btn-primary mr-1' onClick={this.setLdapSetting} value='Update' />
                        <input type='button' disabled={!this.state.check} className='btn btn-info mr-1' onClick={this.testLdapSettings} value='Check Connexion' />
                    </div>
                </div>

                <CreateMatch show={!this.state.check} getMatches={this.getMatches} />
                <div className="form-group mr-3 mt-3" hidden={!this.state.check}>
                    <BootstrapTable keyField='groupName' data={this.state.matches} columns={this.columns} striped />
                </div>
            </Fragment>
        )
    }
} 