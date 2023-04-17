import React, { Component, Fragment, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Row, Col, Form } from 'react-bootstrap'
import apis from '../../../services/apis'

/**
 * Create Robot button with create robot API action call
 */
export default ({ getResultArray, setTaskId, switchTab }) => {

    const [projectName, setProjectName] = useState('')
    const [name, setName] = useState()
    const [value, setValue] = useState()

    const store = useSelector(state => {
        return {
            username: state.OrthancTools.username
        }
    })


    /**
     * Take array of retrieve from Redux and build a retrieve Array to send to API
     */
    const createRobot = async () => {
        //Send the retrieve array to back end
        try {
            let id = await apis.retrieveRobot.createRobot(store.username, projectName, getResultArray())
            setTaskId(id);
            switchTab('MyRobot')
            toast.success('sent to robot', {data:{type:'notification'}})
        } catch (error) {
            console.log(error)
            toast.error(error.statusText + ':' + error.errorMessage, {data:{type:'notification'}})
        }

    }

    /**
     * Fill Robot Name in current state
     * @param {*} event
     */
    const handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.type === 'checkbox' ? target.checked : target.value

        setName(value)

    }

    return (
        <Fragment>
            <Form>
                <Form.Group as={Row} className="mb-3" controlId="formHorizontal">
                    <Form.Label column="sm" sm={2}>Project Name :</Form.Label>
                    <Col sm={8}>
                        <Form.Control type='text' placeholder="Project name..." className="form-control" name='projectName' value={value}
                            onChange={handleChange} />
                    </Col>
                    <Col sm={2}>
                        <input type='button' className='otjs-button otjs-button-blue w-10' onClick={createRobot}
                            value='Add To Robot' />
                    </Col>

                </Form.Group>
            </Form>

        </Fragment>
    )
}


