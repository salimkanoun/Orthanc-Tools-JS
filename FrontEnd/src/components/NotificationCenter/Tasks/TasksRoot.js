import React, { useEffect } from 'react'
import CardJobs from '../Jobs/CardJobs'
import apis from '../../../services/apis'

export default ({ tasksNotifications, remove }) => {

    const monitorJobs = async (notifications) => {
        console.log(notifications)
        let jobsNotifications = notifications.filter((notification) => notification.data?.State !== 'Success' && notification.data?.State !== 'Failure')
        
        for (let i = 0; i < Math.min(6, jobsNotifications.length); i++) {
            let updatedData = JSON.parse(JSON.stringify(jobsNotifications[i].data))
            const jobId = jobsNotifications[i]?.data?.ID
            const jobData = await apis.task.getTask(jobId)
            console.log(jobData)
            //updatedData.State = jobData.State
            //toast.update(jobsNotifications[i].id, { data: updatedData })
        }
    }

    useEffect(() => {
        monitorJobs()
        const intervalID = setInterval(() => {
            monitorJobs(tasksNotifications)
        }, 2000)
        return () => {
            clearInterval(intervalID)
        }
    }, [tasksNotifications])

    const clearTasks = () => {
        tasksNotifications.map(notification => {
            remove(notification.id)
        })
    }

    return (
        <CardJobs title={"Robots"} jobs={tasksNotifications} clear={clearTasks} />
    )

}