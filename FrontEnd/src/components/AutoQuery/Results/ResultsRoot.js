import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

import ResultsSeries from './ResultsSeries'
import ResultsStudies from './ResultsStudies'

export default () => {

    const RESULTS_STUDIES = 'studies'
    const RESULTS_SERIES = 'series'

    const [currentComponent, setCurrentComponent] = useState(RESULTS_STUDIES)

    const getComponentToDisplay = () => {
        switch (currentComponent) {
            case RESULTS_SERIES:
                return <ResultsSeries />
            case RESULTS_STUDIES:
                return <ResultsStudies />
        }
    }

    return (
        <div>
            <div className='mb-5'>
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
            </div>
            <div>
                {getComponentToDisplay()}
            </div>
        </div>
    )

}