import React, { Component, Fragment } from "react"
import Toggle from 'react-toggle'
import apis from "../../../services/apis"
import Select from 'react-select'
import ReactTooltip from "react-tooltip";
import HelpIcon from '@material-ui/icons/HelpSharp';
import CreateMatch from "./CreateMatch";
import { toast } from "react-toastify";
import {Col, Row} from 'react-bootstrap'

export default class Ldap extends Component {

    state = {
        activated: false,
        port: 389,
        DN: '',
        password: '',
        address: '',
        changeType: { value: 'ad', label: 'Active Directory' },
        protocol: '',
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
            this.state.port,
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
        let activated, options

        try {
            //Mode
            activated = await apis.options.getMode()
            //Ldap
            options = await apis.ldap.getLdapSettings()
        } catch (error) {
            toast.error(error.statusText)
            return
        }


        let typeGroup
        if (options.TypeGroup === 'ad') {
            typeGroup = { value: 'ad', label: 'Active Directory' }
        } else if (options.TypeGroup === 'ldap') {
            typeGroup = { value: 'ldap', label: 'LDAP' }
        } else {
            typeGroup = { value: '', label: '' }
        }

        this.setState({
            activated: activated,
            address : options.address,
            protocol: options.protocol,
            changeType: typeGroup,
            port: options.port,
            DN: options.DN,
            password: options.password,
            group: options.group,
            user: options.user,
            base: options.base
        })

    }

    changeMode = async () => {
        try {
            await apis.options.changeMode(!this.state.activated)
            this.setState(prevState => ({activated: !prevState.activated }))
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

    render = () => {
        return (
            <Fragment>
                <Row>
                    <Col>
                        <h2 className='card-title'>Distant Users</h2>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col sm={4}>
                        <h5>LDAP/AD connexion</h5>
                    </Col>
                    <Col>
                        <Toggle checked={this.state.activated} onChange={this.changeMode} />
                    </Col>
                </Row>
                <div className="form-group mr-3">
                    <Row className="mt-3 align-items-center">
                        <Col sm={3}>
                            <label className="pe-2" htmlFor="typeGroup">Connexion type : </label>
                            <HelpIcon data-tip data-for='info1' fontSize="small" color="action" />
                        </Col>
                        <Col sm={3}>
                            <ReactTooltip place="right" effect="solid" id='info1' type='dark'>
                                <span>Choix du type de connexion (en fonction de la nature de votre annuaire): </span>
                                <br></br>
                                <span>1. Active Directory (Microsft's software)</span>
                                <br></br>
                                <span>2. Ldap (Open Souce Softaware)</span>
                            </ReactTooltip>
                            <Select name="typeGroup" controlShouldRenderValue={true} closeMenuOnSelect={true} single options={this.optionsTypeGroup} onChange={this.changeListener} value={this.state.changeType} />
                        </Col>
                        <Col sm={3}>
                            <label className="pe-2" htmlFor="protocol">Protocol : </label>
                            <HelpIcon data-tip data-for='info2' fontSize="small" color="action" />
                        </Col>
                        <Col sm={3}>
                            <ReactTooltip place="right" effect="solid" id='info2' type='dark'>
                                <span><i>ldap//:</i> no secure connexion </span>
                                <br></br>
                                <span><i>ldaps//:</i> secure connexion </span>
                            </ReactTooltip>
                            <input type='text' name="protocol" className="form-control" onChange={this.handleChange} value={this.state.protocol} placeholder="ldap(s)://" />
                        </Col>
                    </Row>
                    <Row className="mt-3 align-items-center">
                        <Col sm={3}>
                            <label className="pe-2" htmlFor="address">Address : </label>
                            <HelpIcon data-tip data-for='info3' fontSize="small" color="action" />
                        </Col>
                        <Col sm={3}>
                            <ReactTooltip place="right" effect="solid" id='info3' type='dark'>
                                    <span>Domain name or IP of the online directory</span>
                                    <br></br>
                                    <span>example : <i>127.0.0.1</i> or <i>chu.exemple.fr</i></span>
                            </ReactTooltip>
                            <input type='text' name="address" className="form-control" onChange={this.handleChange} value={this.state.address} />
                        </Col>
                        <Col sm={3}>
                            <label className="pe-2" htmlFor="port">Port : </label>
                            <HelpIcon data-tip data-for='info4' fontSize="small" color="action" />
                        </Col>
                        <Col sm={3}>
                            <ReactTooltip place="right" effect="solid" id='info4' type='dark'>
                                    <span><i>389</i> no secure connexion </span>
                                    <br></br>
                                    <span><i>636</i> secure connexion </span>
                            </ReactTooltip>
                            <input type='number' min='0' max='1000' name='port' className='form-control' onChange={this.handleChange} value={this.state.port} />
                        </Col>
                    </Row>
                    <Row className="mt-3 align-items-center">
                        <Col sm={3}>
                            <label className="pe-2" htmlFor="base" >Base DN : </label>
                            <HelpIcon data-tip data-for='info9' fontSize="small" color="action" />
                        </Col>
                        <Col sm={9}>
                            <ReactTooltip place="right" effect="solid" id='info9' type='dark'>
                                <span>Base DN of the directoy from witch connexion will be established</span>
                                <br></br>
                                <span>example : <i>dc=chu,dc=exemple,dc=fr</i></span>
                            </ReactTooltip>
                            <input type='text' name="base" className="form-control" value={this.state.base} onChange={this.handleChange} />
                        </Col>
                    </Row>
                    <Row className="mt-3 align-items-center">
                        <Col sm={3}>
                            <label className="pe-2" htmlFor="DN" >Bind DN :</label>
                            <HelpIcon data-tip data-for='info5' fontSize="small" color="action" />
                        </Col>
                        <Col sm={3}>
                            <ReactTooltip place="right" effect="solid" id='info5' type='dark'>
                                    <span>DN from witch user researchs will be made</span>
                            </ReactTooltip>
                            <input type='text' name="DN" className="form-control" value={this.state.DN} onChange={this.handleChange} />
                        </Col>
                        <Col sm={3}>
                            <label className="pe-2" htmlFor="password">Bind DN password : </label>
                            <HelpIcon data-tip data-for='info6' fontSize="small" color="action" />
                        </Col>
                        <Col sm={3}>
                            <ReactTooltip place="right" effect="solid" id='info6' type='dark'>
                                <span>Password of the user from witch researchs will be made</span>
                            </ReactTooltip>
                            <input type='password' name="password" className="form-control" value={this.state.password} onChange={this.handleChange} />
                        </Col>
                    </Row>
                    <Row className="mt-3 align-items-center">
                        <Col sm={3}>
                            <label  className="pe-2" htmlFor="group">Group Filter : </label>
                            <HelpIcon data-tip data-for='info7' fontSize="small" color="action" />
                        </Col>
                        <Col sm={3}>
                            <ReactTooltip place="right" effect="solid" id='info7' type='dark'>
                                <span>DN for groups researchs</span>
                            </ReactTooltip>
                            <input type='text' name="group" className="form-control" onChange={this.handleChange} value={this.state.group} />
                        </Col>
                        <Col sm={3}>
                            <label className="pe-2" htmlFor="user">User filter </label>
                            <HelpIcon data-tip data-for='info8' fontSize="small" color="action" />
                        </Col>
                        <Col sm={3}>
                            <ReactTooltip place="right" effect="solid" id='info8' type='dark'>
                                <span>DN for users researchs</span>
                            </ReactTooltip>
                            <input type='text' name="user" className="form-control" onChange={this.handleChange} value={this.state.user} />
                        </Col>
                    </Row>
                    <Row className="text-center align-items-center mt-3">
                        <Col className="">
                            <input type='button' className='otjs-button otjs-button-blue w-10' onClick={this.setLdapSetting} value='Update' />
                        </Col>
                        <Col className="">
                            <input type='button' className='otjs-button otjs-button-blue w-10' onClick={this.testLdapSettings} value='Check Connexion' />
                        </Col>
                    </Row>

                </div>
                

                {this.state.activated ? 
                        <CreateMatch/>
                 : null}

            </Fragment>
        )
    }
} 