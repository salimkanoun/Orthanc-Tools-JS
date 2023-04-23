import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import QueryRoot from './Query/QueryRoot'
import ResultsRoot from './Results/ResultsRoot'
import MyRobotRoot from './MyRobot/MyRobotRoot'
import RobotHistoryRoot from './RobotHistory/RobotHistoryRoot'

export default () => {

    const TAB_QUERIES = 'Queries'
    const TAB_RESULTS = 'Results'
    const TAB_MYROBOT = 'MyRobot'
    const TAB_ROBOT_HISTORY = 'history'

    const [currentComponent, setCurrentComponent] = useState(TAB_QUERIES)

    const getComponentToDisplay = () => {
        switch (currentComponent) {
            case TAB_QUERIES:
                return <QueryRoot onQueryFinished={() => setCurrentComponent(TAB_RESULTS)} />
            case TAB_RESULTS:
                return <ResultsRoot onRobotCreated={() => setCurrentComponent(TAB_MYROBOT)}/>
            case TAB_MYROBOT:
                return <MyRobotRoot/>
            case TAB_ROBOT_HISTORY: 
                return <RobotHistoryRoot />
            default:
                break
        }
    }

    return (
        <div>
            <h2>Auto Retrieve</h2>
            <div className='mb-5'>
                <nav className="otjs-navmenu container-fluid">
                    <div className="otjs-navmenu-nav">
                        <li>
                            <Button
                                className={currentComponent === TAB_QUERIES ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentComponent(TAB_QUERIES)}>Queries
                            </Button>
                        </li>
                        <li>
                            <Button
                                className={currentComponent === TAB_RESULTS ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentComponent(TAB_RESULTS)}>Results
                            </Button>
                        </li>
                        <li>
                            <Button
                                className={currentComponent === TAB_MYROBOT ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentComponent(TAB_MYROBOT)}>My Robot
                            </Button>
                        </li>
                        <li>
                            <Button
                                className={currentComponent === TAB_ROBOT_HISTORY ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentComponent(TAB_ROBOT_HISTORY)}>Robot History
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