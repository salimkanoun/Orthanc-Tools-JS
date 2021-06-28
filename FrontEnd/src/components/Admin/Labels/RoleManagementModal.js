import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import { connect } from 'react-redux'
import RoleSelect from "./RoleSelect";

class RoleManagementModal extends Component {

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
                    <Modal.Title>{`${this.props.label} label roles  `}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   <RoleSelect label={this.props.label} username={this.props.username} />
                </Modal.Body>
            </Modal>)
    }
}
const mapStateToProps = (state) => {
    return {
      username: state.OrthancTools.username
    }
  }
  
  export default connect(mapStateToProps)(RoleManagementModal)