import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import QueryRoot from './Query/QueryRoot'
import ResultsRoot from './Results/ResultsRoot'
import MyRobotRoot from './MyRobot/MyRobotRoot'
import RobotHistoryRoot from './RobotHistory/RobotHistoryRoot'
import apis from '../../services/apis'
import Spinner from '../CommonComponents/Spinner'
import { useCustomQuery } from '../../services/ReactQuery/hooks'
import { errorMessage } from '../../tools/toastify'
import { keys } from '../../model/Constant'


const MyRobotWrapper = () => {

    const username = useSelector(state => state.OrthancTools.username)

    const { isLoading, data : retrieveId } = useCustomQuery(
        [keys.ROBOTS_KEY, username, keys.AUTOQUERY_KEY],
        () => apis.task.getTaskOfUser(username, 'retrieve'),
        () => errorMessage('Failed to retrieve robot list'),
        (retrieveIds) => {
            if (retrieveIds.length > 0) {
                return retrieveIds[0]
            } else {
                return null
            }
        }
    )
    
    if (isLoading) return <Spinner />
    if (retrieveId == null) return <></>

    return (
        <MyRobotRoot robotId={retrieveId} />
    )
}

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
                return <ResultsRoot onRobotCreated={() => setCurrentComponent(TAB_MYROBOT)} />
            case TAB_MYROBOT:
                return <MyRobotWrapper />
            case TAB_ROBOT_HISTORY:
                return <RobotHistoryRoot />
            default:
                break
        }
    }

    return (
        <div>
            <div className='mb-5'>
                <div className="d-flex justify-content-start align-items-center pb-3">
                    <i className={"fas fa-recycle icone ico me-3"}></i><h2 className="card-title">Auto Retrieve</h2>
                </div>
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