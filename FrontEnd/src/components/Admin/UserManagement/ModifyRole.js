import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';

import apis from '../../../services/apis'

import RoleForm from './RoleForm'


class ModifyRole extends Component {

    state = { 
        show: false,
        data: {}, 
     };
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.modify = this.modify.bind(this)
        this.child = React.createRef()
    }

    async modify(){
        let permission = this.child.current.getState()
        permission = {
            ...permission, 
            name: this.props.name
        }
        await apis.role.modifyRole(permission).then(() => this.setState({show: false})).catch(error => console.log(error))
    }

    async handleClick(){
        let permission = {}
        await apis.role.getPermission(this.props.name).then(answer => permission = answer[0]).then(()=>{
            this.setState({
                data: {...permission}, 
                show: true
            })
        }).catch(error => console.log(error))
    }

    render() {
        return (
            <Fragment>
                <button type='button' className='btn btn-warning' name='openModify' onClick={this.handleClick}>Edit</button>
                <Modal id='modify' show={this.state.show} onHide={() => this.setState({show: false})}>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Modify role {this.state.data.name}</h2>
                    </Modal.Header>
                    <Modal.Body>  
                        <RoleForm data={this.state.data} ref={this.child}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' name='create' className='btn btn-primary' onClick={this.modify} >Save</button>
                        <button type='button' className='btn btn-info' onClick={() => this.setState({show: false})} >Cancel</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
            
        );
    }
}

export default ModifyRole;