import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

import AutoRetrieveRootPanel from './AutoRetrieveRootPanel'
import TaskFlushPanel from './TaksFlushPanel'

export default () => {

    const RETRIEVE_TAB = 'retrieve'
    const FLUSH_TAB = 'flush'

    const [currentComponent, setcurrentComponent] = useState(RETRIEVE_TAB)

    let getComponentToDisplay = () => {
        let component = null
        switch (currentComponent) {
            case RETRIEVE_TAB:
                component = <AutoRetrieveRootPanel />
                break;
            case FLUSH_TAB:
                component = <TaskFlushPanel />
                break;
            default:
                break;
        }
        return component
    }

    let switchTab = (name) => {
        setcurrentComponent(name)
    }

    return (
        <>
            <div className='mb-5'>
                <nav className="otjs-navmenu container-fluid">
                    <div className="otjs-navmenu-nav">
                        <li className='col-6 text-center'>
                            <Button
                                className={currentComponent === RETRIEVE_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => switchTab(RETRIEVE_TAB)}>Auto Retrieve Robots
                            </Button>
                        </li>
                        <li className='col-6 text-center'>
                            <Button
                                className={currentComponent === FLUSH_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => switchTab(FLUSH_TAB)}>Flush Tasks
                            </Button>
                        </li>
                    </div>
                </nav>
            </div>
            <div>
                {getComponentToDisplay()}
            </div>
        </>
    )
}