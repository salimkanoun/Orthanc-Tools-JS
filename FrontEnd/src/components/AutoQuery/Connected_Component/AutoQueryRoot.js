import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, Button } from 'react-bootstrap'
import TableQuery from './TableQuery'
import Results from './Results'
import RobotView from './RobotView'
import RobotHistoric from './RobotHistoric'
import task from '../../../services/task'

/**
 * Root Panel of AutoQuery module
 * Using Hooks
 */
const AutoQueryRoot = () => {

    const QUERRY = 'Query'
    const RESULT = 'Result'
    const MY_ROBOT = 'MyRobot'
    const HISTORIC = 'Historic'

    const [currentMainTab, setCurrentMainTab] = useState('Query');
    const [lastTaskId, setLastTaskId] = useState(null);
    const username = useSelector(state => state.OrthancTools.username)

    useEffect(() => {
        task.getTaskOfUser(username, 'retrieve').then(id => {
            setLastTaskId(id[0])
        }).catch(() => {
        })
    }, [])

    function getComponentToDisplay() {
        let component = null
        switch (currentMainTab) {
            case QUERRY:
                component = <TableQuery switchTab={switchTab} />
                break
            case RESULT:
                component = <Results switchTab={switchTab} setTaskId={setLastTaskId} />
                break
            case MY_ROBOT:
                component = <RobotView id={lastTaskId} onDelete={() => {
                    switchTab(QUERRY)
                    setLastTaskId(null);
                }} />
                break
            case HISTORIC:
                component = <RobotHistoric username={username} />
                break
            default:
                break
        }

        return component
    }

    function switchTab(tabName) {
        setCurrentMainTab(tabName)
    }

    return (
        <div>
            <div className='mb-5'>
                <Row className="pb-3">
                    <Col className="d-flex justify-content-start align-items-center">
                        <i className="fas fa-recycle ico me-3"></i><h2 className="card-title">Auto-Retrieve</h2>
                    </Col>
                </Row>
                <nav className='otjs-navmenu container-fluid'>
                    <div className="otjs-navmenu-nav">
                        <li className='col-3 text-center'>
                            <Button
                                className={currentMainTab === QUERRY ? 'otjs-navmenu-nav-link link-button-active link-button' : ' otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentMainTab(QUERRY)}>Query List
                            </Button>
                        </li>
                        <li className='col-3 text-center'>
                            <Button
                                className={currentMainTab === RESULT ? 'otjs-navmenu-nav-link link-button-active link-button' : ' otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentMainTab(RESULT)}>Results
                            </Button>
                        </li>
                        <li className='col-3 text-center'>
                            <Button
                                className={currentMainTab === MY_ROBOT ? 'otjs-navmenu-nav-link link-button-active link-button' : ' otjs-navmenu-nav-link link-button' + (!lastTaskId ? " disabled" : "")}
                                onClick={() => {
                                    if (lastTaskId) setCurrentMainTab(MY_ROBOT)
                                }}>My Retrieve Robot
                            </Button>
                        </li>
                        <li className='col-3 text-center'>
                            <Button
                                className={currentMainTab === HISTORIC ? 'otjs-navmenu-nav-link link-button-active link-button' : ' otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentMainTab(HISTORIC)}>History
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

export default AutoQueryRoot