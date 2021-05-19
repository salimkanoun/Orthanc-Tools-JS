import React, {Component} from "react";
import {Button, Modal, Table} from "react-bootstrap";
import { connect } from 'react-redux'
import apis from "../../../services/apis";
import RoleSelect from "./RoleSelect";

class RoleManagementModal extends Component {

    state = {
        roles: [],
        rolelabels: []
    }

    handleAddUser = (e) => {
        e.preventDefault()
    }

    getHandlerRemoveRole(role) {
        return () => apis.rolelabel.createRoleLabel(this.props.username,role,this.props.label);
    }

    componentDidMount() {
        apis.role.getRoles().then(roles => {
            this.setState({roles})
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.label !== prevProps.label) {
            this._refreshRoleLabels();
        }
    }

    _refreshRoleLabels() {
        apis.rolelabel.getLabelRoles(this.props.label).then(rolelabels => {
            this.setState({rolelabels});
        });
    }

    render() {
        return (
            <Modal
                show={
                    !!this.props.label
                }
                onHide={() => this.props.handlerManageRole(null)}
                backdrop="static"
                keyboard={true}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{`${this.props.label} label users`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                        <tr><th>Roles</th></tr>
                        </thead>
                        <tbody>
                            {this.state.rolelabels.map(rolelabel => <tr key={rolelabel.role_name}
                                className={'d-flex justify-content-between align-content-center'}>
                                <td>{this.state.roles.filter(role => role.name === rolelabel.role_name)[0].name}</td>
                                <td><Button  variant={"danger"}
                                        onClick={() => apis.rolelabel.deleteRoleLabel(this.props.username,rolelabel.role_name, this.props.label).then(() => this._refreshRoleLabels())}>
                                    {'X'}
                                </Button></td>
                            </tr>)}
                        </tbody>
                    </Table>
                    <RoleSelect
                        roles={this.state.roles.filter(role => !this.state.rolelabels.map(rl => rl.role_name).includes(role.name))}
                        handleSelect={(selected) => apis.rolelabel.createRoleLabel(this.props.username,selected.name, this.props.label).then(() => this._refreshRoleLabels())}/>
                </Modal.Body>
            </Modal>)
    }
}
const mapStateToProps = (state) => {
    return {
      username: state.OrthancTools.username,
      roles: state.OrthancTools.roles
    }
  }
  
  export default connect(mapStateToProps)(RoleManagementModal)