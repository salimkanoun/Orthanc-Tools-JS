import React, { Component, Fragment } from "react"
import Toggle from 'react-toggle'
import apis from "../../../services/apis"
import BootstrapTable from 'react-bootstrap-table-next';
import Select from 'react-select'
import ReactTooltip from "react-tooltip";
import HelpIcon from '@material-ui/icons/HelpSharp';
import CreateMatch from "./CreateMatch";

class Ldap extends Component {

    state = {
        check: false,
        LDAPport: 389,
        DN: '',
        mdp: '',
        adresse: '',
        changeType: { value: 'ad', label: 'Active Directory' },
        protocole: '',
        matches: [],
        base: '',
        groupe: '',
        user:''

    }

    constructor(props) {
        super(props)
        this.changeMode=this.changeMode.bind(this)
        this.optionsTypeGroupe = [
            { value: 'ad', label: 'Active Directory' },
            { value: 'ldap', label: 'LDAP' }
          ]
        this.changeListener = this.changeListener.bind(this)  
        this.handleChange = this.handleChange.bind(this) 
        this.setLdapSetting = this.setLdapSetting.bind(this)
        this.testLdapSettings = this.testLdapSettings.bind(this)
        this.getMatches = this.getMatches.bind(this)
        this.delete = this.delete.bind(this)
    }

    async getLdapSetting() {
        return await apis.ldap.getLdapSettings()
    }

    async setLdapSetting() {
        const options = {
            TypeGroupe: this.state.changeType.value,
            adresse:this.state.adresse,
            port:this.state.LDAPport,
            DN:this.state.DN,
            mdp:this.state.mdp,
            protocole:this.state.protocole,
            base:this.state.base,
            groupe:this.state.groupe ,
            user:this.state.user
        }
        await apis.ldap.setLdapSettings(options)
    }

    async testLdapSettings() {
       await apis.ldap.testLdapSettings()
    }

    async getModeFromDB() {
        return await apis.options.getMode()
    }

    async componentDidMount() {
        this.getMatches()
        
        //Mode
        let value = await this.getModeFromDB()
        this.setState({check: value})

        //Ldap
        let options = await this.getLdapSetting()
        
        let typeGroupe
        if(options.TypeGroupe === 'ad') {
            typeGroupe = { value: 'ad', label: 'Active Directory' }
        } else if (options.TypeGroupe === 'ldap') {
            typeGroupe = { value: 'ldap', label: 'LDAP' }
        } else {
            typeGroupe = { value: '', label: '' }
        }

        this.setState({protocole: options.protocoles})
        this.setState({changeType: typeGroupe})
        this.setState({adresse: options.adresse})
        this.setState({LDAPport: options.port})
        this.setState({DN: options.DN})
        this.setState({mdp: options.mdp})
        this.setState({groupe: options.groupe})
        this.setState({user: options.user})
        this.setState({base: options.base})
    }

    async changeMode() {
        this.setState(prevState =>({check: !prevState.check}))
        await apis.options.changeMode(!this.state.check)
    }

    handleChange(event) {
        const target = event.target
        const name = target.name
        const value = target.value
        
        this.setState({
            [name]: value
        })
    }

    changeListener(event) {
        this.setState({changeType: event})
    }

    async delete(toDelete) {
        await apis.ldap.deleteMatch(toDelete).then(()=>{
            this.getMatches()
        })
    }

    async getMatches() {
        let answer = await apis.ldap.getAllCorrespodences()
        this.setState({
            matches: answer 
        })
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
            formatter: (cell, row, index) => {
                return <button type='button' name='delete' className='btn btn-danger' onClick={()=>{this.delete(row.groupName)}} >Delete</button>
            }
        }
    ]

    render() {
        return (
            <Fragment>
                <h2 className='card-title'>Distant Users Panel</h2>
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
                                <label htmlFor="typeGroupe">Connexion type : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info1' fontSize="small" color="action"/>
                                <ReactTooltip place="right" effect="solid" id='info1' type='dark'>
                                    <span>Choix du type de connexion (en fonction de la nature de votre annuaire): </span>
                                    <br></br>
                                    <span>1. Active Directory (Logicielle propriétaire de Microsoft)</span>
                                    <br></br>
                                    <span>2. Ldap (Logicielle Open Souce)</span>
                                </ReactTooltip>
                                <Select name="typeGroupe" isDisabled={!this.state.check} controlShouldRenderValue={true} closeMenuOnSelect={true} single options={this.optionsTypeGroupe} onChange={this.changeListener} value={this.state.changeType}/>
                            </div>
                            <div className="col-sm"></div>
                        </div>    
                        <div className="row mt-2">
                            <div className='col-sm'>
                                <label htmlFor="protocole">Protocol : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info2' fontSize="small" color="action"/>
                                <ReactTooltip place="right" effect="solid" id='info2' type='dark'>
                                    <span><i>ldap//:</i> pour une connexion non sécurisée </span>
                                    <br></br>
                                    <span><i>ldaps//:</i> pour une connexion sécurisée </span>
                                </ReactTooltip>
                                <input type='text' disabled={!this.state.check} name="protocole" className="form-control" onChange={this.handleChange} value={this.state.protocole} placeholder="ldap(s)://" />
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="adresse">Adresse : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info3' fontSize="small" color="action"/>
                                <ReactTooltip place="right" effect="solid" id='info3' type='dark'>
                                    <span>Nom de domaine ou adresse IP de l'annuaire</span>
                                    <br></br>
                                    <span>exemple : <i>127.0.0.1</i> ou <i>chu.exemple.fr</i></span>
                                </ReactTooltip>
                                <input type='text' disabled={!this.state.check} name="adresse" className="form-control" onChange={this.handleChange} value={this.state.adresse} />
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="LDAPPort">Port : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info4' fontSize="small" color="action"/>
                                <ReactTooltip place="right" effect="solid" id='info4' type='dark'>
                                    <span><i>389</i> pour une connexion non sécurisée </span>
                                    <br></br>
                                    <span><i>636</i> pour une connexion sécurisée </span>
                                </ReactTooltip>
                                <input type='number' disabled={!this.state.check} min='0' max='1000' name='LDAPport' id='LDAPport' className='form-control' onChange={this.handleChange} value={this.state.LDAPport}/>  
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className='col-sm'>
                            <label htmlFor="base" >Base DN : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info9' fontSize="small" color="action"/>
                                <ReactTooltip place="right" effect="solid" id='info9' type='dark'>
                                    <span>DN de base de l'annuaire à partir de laquel la connexion sera établie</span>
                                    <br></br>
                                    <span>exemple : <i>dc=chu,dc=exemple,dc=fr</i></span>
                                </ReactTooltip>
                                <input type='text' disabled={!this.state.check} name="base" className="form-control" value={this.state.base} onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="row mt-5">
                            <div className='col-sm'>
                                <label htmlFor="DN" >Bind DN :</label>
                                <HelpIcon className="ml-1" data-tip data-for='info5' fontSize="small" color="action"/>
                                <ReactTooltip place="right" effect="solid" id='info5' type='dark'>
                                    <span>DN de l'utilisateur ayant été accrédité par l'administrateur de l'annuaire pour effectuer les recherches</span>
                                </ReactTooltip>
                                <input type='text' disabled={!this.state.check} name="DN" className="form-control" value={this.state.DN} onChange={this.handleChange} />
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="mdp">Bind DN password : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info6' fontSize="small" color="action"/>
                                <ReactTooltip place="right" effect="solid" id='info6' type='dark'>
                                    <span>Mot de Passe de l'utilisateur ayant été accrédité par l'administrateur de l'annuaire pour effectuer les recherches</span>
                                </ReactTooltip>
                                <input type='password' disabled={!this.state.check} name="mdp" className="form-control" value={this.state.mdp} onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="row mt-5">
                            <div className='col-sm'>
                                <label htmlFor="groupe">Group Filter : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info7' fontSize="small" color="action"/>
                                <ReactTooltip place="right" effect="solid" id='info7' type='dark'>
                                    <span>DN à partir duquel la recherche de groupe s'effectue</span>
                                </ReactTooltip>
                                <input type='text' disabled={!this.state.check} name="groupe" className="form-control" onChange={this.handleChange} value={this.state.groupe} />
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="user">User filter </label>
                                <HelpIcon className="ml-1" data-tip data-for='info8' fontSize="small" color="action"/>
                                <ReactTooltip place="right" effect="solid" id='info8' type='dark'>
                                    <span>DN à partir duquel la recherche d'utilisateur s'effectue</span>
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

export default Ldap;