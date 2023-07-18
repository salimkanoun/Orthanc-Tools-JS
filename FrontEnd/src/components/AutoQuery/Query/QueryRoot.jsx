import React, { useState } from 'react'

import { Button, Container, Modal, Row } from 'react-bootstrap'
import QueryStudies from './QueryStudies'
import QuerySeries from './QuerySeries'

export default ((onQueryFinished) => {
    const QUERY_STUDIES = 'studies'
    const QUERY_SERIES = 'series'

    const [currentComponent, setCurrentComponent] = useState(QUERY_STUDIES)

    const getComponentToDisplay = () => {
        switch (currentComponent) {
            case QUERY_STUDIES:
                return <QueryStudies onQueryStudiesFinished={() => onQueryFinished('studies')}/>
            case QUERY_SERIES:
                return <QuerySeries onQuerySeriesFinished={() => onQueryFinished('series')}/>
        }
    }

    return (
        <Container fluid>
            <Row className='mb-5'>
                <nav className="otjs-navmenu container-fluid">
                    <div className="otjs-navmenu-nav">
                        <li className='col-4 text-center'>
                            <Button
                                className={currentComponent === QUERY_STUDIES ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentComponent(QUERY_STUDIES)}>Studies Level
                            </Button>
                        </li>
                        <li className='col-4 text-center'>
                            <Button
                                className={currentComponent === QUERY_SERIES ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentComponent(QUERY_SERIES)}>Series Level
                            </Button>
                        </li>
                    </div>
                </nav>
            </Row>
            <Row>
                {getComponentToDisplay()}
            </Row>
        </Container>
    )
})