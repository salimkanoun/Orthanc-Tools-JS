import React, { Component, Fragment } from "react"
import Toggle from 'react-toggle'
import apis from "../../../services/apis"
import BootstrapTable from 'react-bootstrap-table-next';
import Select from 'react-select'
import ReactTooltip from "react-tooltip";
import HelpIcon from '@material-ui/icons/HelpSharp';

class Ldap extends Component {

    state = {
        check: false,
        LDAPport: 389,
        roles: [],
        DN: '',
        mdp: '',
        adresse: '',
        changeType: ''
    }

    constructor(props) {
        super(props)
        this.changeMode=this.changeMode.bind(this)
        this.optionsTypeGroupe = [
            { value: 'ad', label: 'MemberOf (Active Directory)' },
            { value: 'memberOf', label: 'MemberOf (LDAP)' }
          ]
        this.changeListener = this.changeListener.bind(this)  
        this.handleChange = this.handleChange.bind(this) 
    }

    async getModeFromDB() {
        return await apis.options.getMode()
    }

    async componentWillMount() {
        let value = await this.getModeFromDB()
        this.setState({check: value})
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

    columns = [
        {
            dataField: 'groupName', 
            text: 'Group name', 
            sort: true
        }, {
            dataField: 'associedRole', 
            text: 'Associed role', 
            formatter: (cell, row, index) => {
            }
        }, {
            dataField: 'delete', 
            text: 'Delete', 
            formatter: (cell, row, index) => {
            }
        }
    ]

    render() {
        return (
            <div>
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
                                <label htmlFor="typeGroupe">Type de groupe : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info' fontSize="small" color="action"/>
                                <ReactTooltip place="right" effect="solid" id='info' type='dark'>
                                    <span>Show happy face</span>
                                </ReactTooltip>
                                <Select name="typeGroupe" isDisabled={!this.state.check} controlShouldRenderValue={true} closeMenuOnSelect={true} single options={this.optionsTypeGroupe} onChange={this.changeListener} value={this.state.changeType}/>
                            </div>
                            <div className="col-sm"></div>
                        </div>    
                        <div className="row mt-2">
                            <div className='col-sm'>
                                <label htmlFor="adresse">Adresse : </label>
                                <input type='text' disabled={!this.state.check} name="adresse" className="form-control" onChange={this.handleChange} value={this.state.adresse} placeholder="ldap://" />
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="LDAPPort">Port : </label>
                                <input type='number' min='0' max='1000' name='LDAPport' id='LDAPport' className='form-control' onChange={this.handleChange} value={this.state.LDAPport}/>  
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className='col-sm'>
                                <label htmlFor="DN" >Nom de Domaine de la Liaison LDAP : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info' fontSize="small" color="action"/>
                                <ReactTooltip place="right" effect="solid" id='info' type='dark'>
                                    <span>Show happy face</span>
                                </ReactTooltip>
                                <input type='text' disabled={!this.state.check} name="DN" className="form-control" value={this.state.DN} onChange={this.handleChange} />
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="mdp">Mot de Passe de la Liaison LDAP : </label>
                                <HelpIcon className="ml-1" data-tip data-for='info' fontSize="small" color="action"/>
                                <ReactTooltip place="right" effect="solid" id='info' type='dark'>
                                    <span>Show happy face</span>
                                </ReactTooltip>
                                <input type='password' disabled={!this.state.check} name="mdp" className="form-control" value={this.state.mdp} onChange={this.handleChange} />
                            </div>
                        </div>            
                    </div>
                    <div className="form-group text-right mr-2">
                    <input type='button' disabled={!this.state.check} className='btn btn-primary mr-1' onClick={null} value='Update' />
                    <input type='button' disabled={!this.state.check} className='btn btn-info mr-1' onClick={null} value='Check Connexion' />
                    </div>         
                </div>

                <button type='button' hidden={!this.state.check} className='btn btn-primary mr-3 mt-2' onClick={() => this.setState({show: true})} >New Correspondence</button>
                <div className="form-group mr-3 mt-3" hidden={!this.state.check}>
                    <BootstrapTable keyField='groupName' data={this.state.roles} columns={this.columns} striped />
                </div>
            </div>         
        )
    }    
}    

export default Ldap;