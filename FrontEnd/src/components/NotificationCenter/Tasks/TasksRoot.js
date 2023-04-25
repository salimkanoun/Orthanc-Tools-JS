import React, { useCallback, useEffect } from 'react'
import CardJobs from '../CardJobs'
import apis from '../../../services/apis'
import { toast } from 'react-toastify'

export default ({ tasksNotifications, remove }) => {

    const monitorJobs = useCallback(async () => {
        let jobsNotifications = tasksNotifications.filter((notification) => notification.data?.State !== 'completed' && notification.data?.State !== 'Failure')

        for (let i = 0; i < Math.min(6, jobsNotifications.length); i++) {
            let updatedData = JSON.parse(JSON.stringify(jobsNotifications[i].data))
            const jobId = jobsNotifications[i]?.data?.ID
            const jobData = await apis.task.getTask(jobId)
            updatedData.state = jobData.state
            toast.update(jobsNotifications[i].id, { data: updatedData })
        }
    }, [JSON.stringify(tasksNotifications)])

    useEffect(() => {
        monitorJobs()
        const intervalID = setInterval(() => {
            monitorJobs()
        }, 2000)
        return () => {
            clearInterval(intervalID)
        }
    }, [])

    const clearTasks = () => {
        tasksNotifications.map(notification => {
            remove(notification.id)
        })
    }

    return (
        <CardJobs title={"Robots"} jobs={tasksNotifications} clear={clearTasks} />
    )

}