import React, { useState } from 'react'
import { Button, Container, Row } from 'react-bootstrap'

import ResultsSeries from './ResultsSeries'
import ResultsStudies from './ResultsStudies'
import CreateRobot from './CreateRobot'

export default ({onRobotCreated, currentComponentRoot}) => {

    const RESULTS_STUDIES = 'studies'
    const RESULTS_SERIES = 'series'

    const [currentComponent, setCurrentComponent] = useState(currentComponentRoot)

    const getComponentToDisplay = () => {
        switch (currentComponent) {
            case RESULTS_SERIES:
                return <ResultsSeries />
            case RESULTS_STUDIES:
                return <ResultsStudies />
        }
    }

    return (
        <Container fluid>
            <Row className='mb-5'>
                <nav className="otjs-navmenu container-fluid">
                    <div className="otjs-navmenu-nav">
                        <li className='col-4 text-center'>
                            <Button
                                className={currentComponent === RESULTS_STUDIES ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentComponent(RESULTS_STUDIES)}>Studies Level
                            </Button>
                        </li>
                        <li className='col-4 text-center'>
                            <Button
                                className={currentComponent === RESULTS_SERIES ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentComponent(RESULTS_SERIES)}>Series Level
                            </Button>
                        </li>
                    </div>
                </nav>
            </Row>
            <Row>
                {getComponentToDisplay()}
            </Row>
            <Row className='mt-3'>
                <CreateRobot onRobotCreated={onRobotCreated}/>
            </Row>
        </Container>
    )

}