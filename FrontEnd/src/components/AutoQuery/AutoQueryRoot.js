import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import QueryRoot from './Query/QueryRoot'

export default () => {

    const TAB_QUERIES = 'Queries'
    const TAB_RESULTS = 'Results'
    const TAB_MYROBOT = 'MyRobot'

    const [currentComponent, setCurrentComponent] = useState(TAB_QUERIES)

    const getComponentToDisplay = () => {
        switch (currentComponent) {
            case TAB_QUERIES:
                return <QueryRoot />
            case TAB_RESULTS:
                return null
            case TAB_MYROBOT:
                return null
            default:
                break
        }
    }

    return (
        <div>
            <div className='mb-5'>
                <nav className="otjs-navmenu container-fluid">
                    <div className="otjs-navmenu-nav">
                        <li className='col-4 text-center'>
                            <Button
                                className={currentComponent === TAB_QUERIES ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentComponent(TAB_QUERIES)}>Queries
                            </Button>
                        </li>
                        <li className='col-4 text-center'>
                            <Button
                                className={currentComponent === TAB_RESULTS ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentComponent(TAB_RESULTS)}>Results
                            </Button>
                        </li>
                        <li className='col-4 text-center'>
                            <Button
                                className={currentComponent === TAB_MYROBOT ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentComponent(TAB_MYROBOT)}>My Robot
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