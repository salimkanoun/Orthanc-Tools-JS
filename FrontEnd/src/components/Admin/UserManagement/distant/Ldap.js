import React, { Fragment, useEffect, useState } from "react"

import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import Toggle from 'react-toggle'
import Select from 'react-select'
import HelpIcon from '@mui/icons-material/HelpSharp';

import apis from "../../../../services/apis";
import CreateMatch from "./CreateMatch";
import { errorMessage, successMessage } from "../../../../tools/toastify";


export default () => {

    const [activated, setActivated] = useState(false)
    const [port, setPort] = useState(389)
    const [DN, setDN] = useState('')
    const [password, setPassword] = useState('')
    const [address, setAddress] = useState('')
    const [changeType, setChangeType] = useState({ value: 'ad', label: 'Active Directory' })
    const [protocol, setProtocol] = useState('')
    const [base, setBase] = useState('')
    const [group, setGroup] = useState('')
    const [user, setUser] = useState('')

    const optionsTypeGroup = [
        { value: 'ad', label: 'Active Directory' },
        { value: 'ldap', label: 'LDAP' }
    ]

    const setLdapSetting = () => {
        apis.ldap.setLdapSettings(changeType.value,
            address,
            port,
            DN,
            password,
            protocol,
            base,
            group,
            user)
            .then(() => { successMessage('LDAP Settings updated') })
            .catch((error) => { errorMessage(error.statusText) })
    }

    const testLdapSettings = () => {

        apis.ldap.testLdapSettings().then(answer => {
            if (answer) {
                successMessage('Connexion established')
            } else {
                errorMessage('connexion failed')
            }
        }).catch((error) => {
            errorMessage(error.statusText)
        })
    }

    useEffect(() => {

        const getActivated = async () => { await apis.options.getMode() }
        const getOptions = async () => { await apis.ldap.getLdapSettings() }

        let activated, options

        try {
            //Mode
            activated = getActivated()
            //Ldap
            options = getOptions()
        } catch (error) {
            errorMessage(error.statusText)
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

        setActivated(activated)
        setAddress(options.address)
        setProtocol(options.protocol)
        setChangeType(typeGroup)
        setPort(options.port)
        setDN(options.DN)
        setPassword(options.password)
        setGroup(options.group)
        setUser(options.user)
        setBase(options.base)
    }, [])


    const changeMode = async () => {
        try {
            await apis.options.changeMode(!activated)
            setActivated(!activated)
        } catch (error) {
            errorMessage(error.statusText)
        }
    }

    const changeListener = (event) => {
        setChangeType(event)
    }


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
                    <Toggle checked={activated} onChange={changeMode} />
                </Col>
            </Row>

            <Row className="mt-3 align-items-center">
                <Col sm={3}>
                    <label className="pe-2" htmlFor="typeGroup">Connexion type : </label>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={connexionTooltip}
                    >
                        <HelpIcon data-tip data-for='info1' fontSize="small" color="action" />
                    </OverlayTrigger>
                </Col>
                <Col sm={3}>
                    <Select name="typeGroup" controlShouldRenderValue={true} closeMenuOnSelect={true} single options={optionsTypeGroup} onChange={changeListener} value={changeType} />
                </Col>
                <Col sm={3}>
                    <label className="pe-2" htmlFor="protocol">Protocol : </label>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={protocolTooltip}
                    >
                        <HelpIcon data-tip data-for='info1' fontSize="small" color="action" />
                    </OverlayTrigger>
                </Col>
                <Col sm={3}>
                    <input type='text' name="protocol" className="form-control" onChange={(event) => setProtocol(event.target.value)} value={protocol} placeholder="ldap(s)://" />
                </Col>
            </Row>
            <Row className="mt-3 align-items-center">
                <Col sm={3}>
                    <label className="pe-2" htmlFor="address">Address : </label>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={addressTooltip}
                    >
                        <HelpIcon data-tip data-for='info3' fontSize="small" color="action" />
                    </OverlayTrigger>
                </Col>
                <Col sm={3}>
                    <input type='text' name="address" className="form-control" onChange={(event) => setAddress(event.target.value)} value={address} />
                </Col>
                <Col sm={3}>
                    <label className="pe-2" htmlFor="port">Port : </label>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={portTooltip}
                    >
                        <HelpIcon data-tip data-for='info3' fontSize="small" color="action" />
                    </OverlayTrigger>
                </Col>
                <Col sm={3}>
                    <input type='number' min='0' max='1000' name='port' className='form-control' onChange={(event) => setPort(event.target.value)} value={port} />
                </Col>
            </Row>
            <Row className="mt-3 align-items-center">
                <Col sm={3}>
                    <label className="pe-2" htmlFor="base" >Base DN : </label>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={baseDNTooltip}
                    >
                        <HelpIcon data-tip data-for='info3' fontSize="small" color="action" />
                    </OverlayTrigger>
                </Col>
                <Col sm={9}>
                    <input type='text' name="base" className="form-control" value={base} onChange={(event) => setBase(event.target.value)} />
                </Col>
            </Row>
            <Row className="mt-3 align-items-center">
                <Col sm={3}>
                    <label className="pe-2" htmlFor="DN" >Bind DN :</label>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={bindDNTooltip}
                    >
                        <HelpIcon data-tip data-for='info3' fontSize="small" color="action" />
                    </OverlayTrigger>
                </Col>
                <Col sm={3}>
                    <input type='text' name="DN" className="form-control" value={DN} onChange={(event) => setDN(event.target.value)} />
                </Col>
                <Col sm={3}>
                    <label className="pe-2" htmlFor="password">Bind DN password : </label>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={passwordTooltip}
                    >
                        <HelpIcon data-tip data-for='info3' fontSize="small" color="action" />
                    </OverlayTrigger>
                </Col>
                <Col sm={3}>
                    <input type='password' name="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} />
                </Col>
            </Row>
            <Row className="mt-3 align-items-center">
                <Col sm={3}>
                    <label className="pe-2" htmlFor="group">Group Filter : </label>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={groupFilterTooltip}
                    >
                        <HelpIcon data-tip data-for='info3' fontSize="small" color="action" />
                    </OverlayTrigger>
                </Col>
                <Col sm={3}>
                    <input type='text' name="group" className="form-control" onChange={(event) => setGroup(event.target.value)} value={group} />
                </Col>
                <Col sm={3}>
                    <label className="pe-2" htmlFor="user">User filter </label>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={userFilterTooltip}
                    >
                        <HelpIcon data-tip data-for='info3' fontSize="small" color="action" />
                    </OverlayTrigger>
                </Col>
                <Col sm={3}>
                    <input type='text' name="user" className="form-control" onChange={(event) => setUser(event.target.value)} value={user} />
                </Col>
            </Row>
            <Row className="text-center align-items-center mt-3">
                <Col className="">
                    <input type='button' className='otjs-button otjs-button-blue w-10' onClick={setLdapSetting} value='Update' />
                </Col>
                <Col className="">
                    <input type='button' className='otjs-button otjs-button-blue w-10' onClick={testLdapSettings} value='Check Connexion' />
                </Col>
            </Row>
            {activated ?
                <CreateMatch />
                : null
            }

        </Fragment>
    )
}

const connexionTooltip = (props) => {
    return (
        <Tooltip  {...props}>
            <span>Choix du type de connexion (en fonction de la nature de votre annuaire): </span>
            <br></br>
            <span>1. Active Directory (Microsft's software)</span>
            <br></br>
            <span>2. Ldap (Open Souce Softaware)</span>
        </Tooltip>
    )
}

const protocolTooltip = (props) => {
    return (
        <Tooltip  {...props}>
            <span><i>ldap//:</i> no secure connexion </span>
            <br></br>
            <span><i>ldaps//:</i> secure connexion </span>
        </Tooltip>)
}

const addressTooltip = (props) => {
    return (
        <Tooltip  {...props}>
            <span>Domain name or IP of the online directory</span>
            <br></br>
            <span>example : <i>127.0.0.1</i> or <i>chu.exemple.fr</i></span>
        </Tooltip>)
}

const portTooltip = (props) => {
    return (
        <Tooltip  {...props}>
            <span><i>389</i> no secure connexion </span>
            <br></br>
            <span><i>636</i> secure connexion </span>
        </Tooltip>)
}

const baseDNTooltip = (props) => {
    return (
        <Tooltip  {...props}>
            <span>Base DN of the directoy from witch connexion will be established</span>
            <br></br>
            <span>example : <i>dc=chu,dc=exemple,dc=fr</i></span>
        </Tooltip>)
}

const bindDNTooltip = (props) => {
    return (
        <Tooltip  {...props}>
            <span>DN from witch user researchs will be made</span>
        </Tooltip>)
}

const passwordTooltip = (props) => {
    return (
        <Tooltip  {...props}>
            <span>Password of the user from witch researchs will be made</span>
        </Tooltip>)
}

const groupFilterTooltip = (props) => {
    return (
        <Tooltip  {...props}>
            <span>DN for groups researchs</span>
        </Tooltip>)
}

const userFilterTooltip = (props) => {
    return (
        <Tooltip  {...props}>
            <span>DN for users researchs</span>
        </Tooltip>)
}