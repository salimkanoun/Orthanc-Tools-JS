import React, {Component, Fragment} from 'react'
import { Button } from 'react-bootstrap';
import ModalCreateDicom from "./ModalCreateDicom";


export default class CreateDicom extends Component {

    state = {
        show: false
    }

    openModify = () => {
        this.setState({show: true})
    }

    render = () => {
        return (
            <Fragment>
                <Button className='dropdown-item bg-primary' type='button'
                        onClick={this.openModify}>Create Dicom
                </Button>
                <ModalCreateDicom
                    show={this.state.show}
                    onHide={() => this.setState({show: false})}
                    modify={() => this.modify()}
                    OrthancID={this.props.orthancID}
                    level={this.props.level}
                />
            </Fragment>
        )
    }
}