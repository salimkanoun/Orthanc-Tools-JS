import React, { useState } from 'react'
import AutoRetrieveRootPanel from './AutoRetrieveRootPanel'
import TaskFlushPanel from './TaksFlushPanel'

const TaskRootPanel = () => {

    const [currentComponent, setcurrentComponent] = useState('retrieve')

    let getComponentToDisplay = () => {
        let component = null
        switch (currentComponent) {
            case 'retrieve':
                component = <AutoRetrieveRootPanel/>
                break;
            case 'flush':
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
            <div>
                <div className='mb-5'>
                    <ul className='nav nav-pills nav-fill'>
                        <li className='nav-item'>
                            <button className={currentComponent === 'retrieve' ? 'col nav-link active link-button' : 'col link-button'} onClick={() => switchTab('retrieve')}> Auto Retrieve Robots </button>
                        </li>
                        <li className='nav-item'>
                            <button className={currentComponent === 'flush' ? 'col nav-link active link-button' : ' col link-button'} onClick={() => switchTab('flush')}> Flush Tasks </button>
                        </li>
                    </ul>
                </div>
                <div>
                    {getComponentToDisplay()}
                </div>
            </div>
        </>
    )
}

export default TaskRootPanel