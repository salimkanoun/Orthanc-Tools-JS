import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {toast} from 'react-toastify'
import {Row,Col,Form} from 'react-bootstrap'
import apis from '../../../services/apis'

/**
 * Create Robot button with create robot API action call
 */
class CreateRobot extends Component {

    state = {
        projectName: ''
    }

    /**
     * Take array of retrieve from Redux and build a retrieve Array to send to API
     */
    createRobot = async () => {
        //Send the retrieve array to back end
        try {
            let id = await apis.retrieveRobot.createRobot(this.props.username, this.state.projectName, this.props.getResultArray())
            this.props.setTaskId(id);
            this.props.switchTab('MyRobot')
            toast.success('sent to robot')
        } catch (error) {
            console.log(error)
            toast.error(error.statusText + ':' + error.errorMessage)
        }

    }

    /**
     * Fill Robot Name in current state
     * @param {*} event
     */
    handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.type === 'checkbox' ? target.checked : target.value

        this.setState({
            [name]: value
        })

    }

    render = () => {
        return (
            <Fragment>
                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontal">
                        <Form.Label column="sm" sm={2}>Project Name :</Form.Label>
                        <Col sm={8}>
                            <Form.Control type='text' placeholder="Project name..." className="form-control" name='projectName' value={this.state.value}
                                onChange={this.handleChange}/>
                        </Col>
                        <Col sm={2}>
                            <input type='button' className='otjs-button otjs-button-blue w-10' onClick={this.createRobot}
                                value='Add To Robot'/>
                        </Col>
                        
                    </Form.Group>
                </Form>
               
            </Fragment>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        username: state.OrthancTools.username
    }
}

export default connect(mapStateToProps, null)(CreateRobot)
