import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select'

import apis from '../../../services/apis'


class CreateCorrespondence extends Component {
    state = { 
        show: false, 
        groupName:'',
        associedRole:'',
        optionsAssociedRole: [],
        optionsGroupeName: []
    }

    constructor(props){
        super(props)
        this.create = this.create.bind(this)

        this.changeRole = this.changeRole.bind(this)
        this.changeGroupe = this.changeGroupe.bind(this)

    }

    componentDidMount() {
        this.getGroupName()
        this.getAssociedRole()
    }

    changeGroupe(event) {
        this.setState({groupName: event})
    }

    changeRole(event) {
        this.setState({associedRole: event})
    }

    async getGroupName() {
        let list = await apis.ldap.getAllGroupName()

        this.setState({ optionsGroupeName:list
        })
    }

    async getAssociedRole() {
        let res = []
        let list = await apis.role.getRoles()
        for(let i=0; i<list.length; i++) {
            res.push({value:list[i].name, label:list[i].name})
        }
        this.setState({
            optionsAssociedRole: res
        })
    }

    async create(){
            await apis.ldap.createCorrespondence({groupName:this.state.groupName.value, associedRole:this.state.associedRole.value}).then(()=>{
                this.props.getCorrespondences()
                this.setState({
                    show: false, 
                })
                
            }).catch(error => console.log(error))
    }

    render() {
        return (
            <Fragment>
                <button type='button' hidden={this.props.show} className='btn btn-primary mr-3 mt-2' onClick={() => this.setState({show: true})} >New correspondence</button>
                <Modal id='create' show={this.state.show} onHide={() => this.setState({show: false})}>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Create new correspondence</h2>
                    </Modal.Header>
                    <Modal.Body>   
                        <label>Group name</label>
                        <Select name="typeGroupe" controlShouldRenderValue={true} closeMenuOnSelect={true} single options={this.state.optionsGroupeName} onChange={this.changeGroupe} value={this.state.groupName} required/>
                        
                        <label className='mt-3'>Associed role</label>
                        <Select name="typeGroupe" controlShouldRenderValue={true} closeMenuOnSelect={true} single options={this.state.optionsAssociedRole} onChange={this.changeRole} value={this.state.associedRole} required/>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' name='create' className='btn btn-primary' onClick={this.create} >Create</button>
                        <button type='button' className='btn btn-info' onClick={() => this.setState({show: false})} >Cancel</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
            
        );
    }
}

export default CreateCorrespondence;