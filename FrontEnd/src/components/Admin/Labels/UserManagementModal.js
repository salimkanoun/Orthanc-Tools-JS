import React, {Component} from "react";
import {Button, Modal, Table} from "react-bootstrap";
import apis from "../../../services/apis";
import UserSelect from "./UserSelect";

export default class UserManagementModal
    extends Component {

    state = {
        users: [],
        userlabels: []
    }

    handleAddUser = (e) => {
        e.preventDefault()
    }

    getHandlerRemoveUser(user) {
        return () => apis.userlabel.createUserLabel(this.props.label, user);
    }

    componentDidMount() {
        apis.User.getUsers().then(users => {
            this.setState({users})
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.label !== prevProps.label) {
            this._refreshUserLabels();
        }
    }

    _refreshUserLabels() {
        apis.userlabel.getLabelUsers(this.props.label).then(userlabels => {
            this.setState({userlabels});
        });
    }

    render() {
        return (
            <Modal
                show={
                    !!this.props.label
                }
                onHide={() => this.props.handlerManageUser(null)}
                backdrop="static"
                keyboard={true}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{`${this.props.label} label users`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                        <th>Users</th>
                        </thead>
                        {this.state.userlabels.map(userlabel => <tr
                            className={'d-flex justify-content-between align-content-center'}>
                            <p>{this.state.users.filter(user => user.id === userlabel.user_id)[0].username}</p>
                            <Button variant={"danger"}
                                    onClick={() => apis.userlabel.deleteUserLabel(userlabel.user_id, this.props.label).then(() => this._refreshUserLabels())}>
                                {'X'}
                            </Button>
                        </tr>)}
                    </Table>
                    <UserSelect
                        users={this.state.users.filter(user => !this.state.userlabels.map(ul => ul.user_id).includes(user.id))}
                        handleSelect={(selected) => apis.userlabel.createUserLabel(selected.id, this.props.label).then(() => this._refreshUserLabels())}/>
                </Modal.Body>
            </Modal>)
    }
}