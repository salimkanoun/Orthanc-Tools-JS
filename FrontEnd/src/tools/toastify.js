import { toast } from 'react-toastify'

export const successMessage = (message) => {
    toast.success(message, { containerId: 'message' })
}

export const errorMessage = (message) => {
    toast.error(message, { containerId: 'message' })
}

export const jobMessageToNotificationCenter = (jobId) => {
    toast.info(jobId, { data: { id: jobId }, containerId: 'jobs', type: 'jobs' })
}