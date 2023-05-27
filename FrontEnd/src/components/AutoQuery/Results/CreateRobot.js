import React, { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { errorMessage, successMessage } from '../../../tools/toastify'
import { useSelector } from 'react-redux'
import apis from '../../../services/apis'

export default ({ onRobotCreated }) => {

    const [name, setName] = useState('')

    const store = useSelector(state => {
        return {
            username: state.OrthancTools.username,
            results: state.AutoRetrieveResultList.results,
            resultsSeries: state.AutoRetrieveResultList.resultsSeries
        }
    })

    const buildArrayRetrieve = () => {

        let retrieveArray = []

        //If series details have been loaded robot will be defined at series level
        if (Object.keys(store.resultsSeries).length > 0) {
            let seriesUIDArray = Object.keys(store.resultsSeries)

            for (let seriesUID of seriesUIDArray) {
                let seriesObject = store.resultsSeries[seriesUID]
                retrieveArray.push({
                    ...store.results[seriesObject['StudyInstanceUID']],
                    ...seriesObject
                })
            }
            //Else only use the study results
        } else {

            let studiesUIDArray = Object.keys(store.results)

            for (let studyInstanceUID of studiesUIDArray) {
                retrieveArray.push({ ...store.results[studyInstanceUID] })
            }
        }

        return retrieveArray

    }

    /**
     * Take array of retrieve from Redux and build a retrieve Array to send to API
     */
    const createRobot = async () => {
        //Send the retrieve array to back end
        try {
            let id = await apis.retrieveRobot.createRobot(store.username, name, buildArrayRetrieve())
            onRobotCreated(id)
            successMessage('sent to robot')
        } catch (error) {
            errorMessage(error?.data?.errorMessage)
        }

    }

    const handleNameChange = (event) => {
        const value = event.target.value
        setName(value)
    }

    return (
        <Form>
            <Form.Group as={Row} className="mb-3" controlId="formHorizontal">
                <Form.Label column="sm" sm={2}>Project Name :</Form.Label>
                <Col sm={8}>
                    <Form.Control type='text' placeholder="Project name..." className="form-control" name='projectName' value={name}
                        onChange={handleNameChange} />
                </Col>
                <Col sm={2}>
                    <input type='button' className='otjs-button otjs-button-blue w-10' onClick={createRobot}
                        value='Add To Robot' />
                </Col>

            </Form.Group>
        </Form>
    )
}