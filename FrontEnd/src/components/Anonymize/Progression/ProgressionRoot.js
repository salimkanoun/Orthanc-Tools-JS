import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import apis from '../../../services/apis'
import task from '../../../services/task'
import AnonymizedResults from './AnonymizedResults'
import AnonymizePanelProgress from './AnonymizePanelProgress'

export default () => {

    const store = useSelector(state => {
        return {
            username: state.OrthancTools.username
        }
    })

    const getAnonTaskId = async () => {
        const taskID = await apis.task.getTaskOfUser(store.username, 'anonymize')
        console.log(taskID[0])
        const anonTask = await task.getTask(taskID[0]) 
        console.log(anonTask)
        return anonTask
    }


    //const anonTask = await apis.task.getTask(jobUuid)
    /*
    useEffect(() => {
        //Sk / Voir si robot anoymisation de cet utilisateur est en cours
        const getTaskOfUser = async () => { await apis.task.getTaskOfUser(store.username, 'anonymize') }
    }, [])

    */

    /*
    
    useEffect(() => {
        if (anonTaskID) {
            
            if (!!anonTask) {
                handleTask(anonTask);
                if (!["completed", "failed"].includes(anonTask.state)) {
                    this.monitor = new MonitorTask(anonTaskID, 4000);
                    this.monitor.onUpdate(handleTask.bind(this));
                    this.monitor.onFinish(() => {
                    });
                    this.monitor.startMonitoringJob();
                }
            }
        }
    }, [])
    */

    return ( console.log("Progression root"))
        /*<Row className="align-items-center justify-content-center">
            <Col md={12} className="text-center mb-4" style={{ "max-width": '20%' }}>
                <AnonymizePanelProgress />
            </Col>
            <Col md={12}>
                <AnonymizedResults />
            </Col>
        </Row>
    )*/
}