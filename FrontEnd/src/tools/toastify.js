import { toast } from 'react-toastify'

export const successMessage = (message) => {
    return toast.success(message, { containerId: 'message' })
}

export const infoMessage = (message) => {
    return toast.info(message, { containerId: 'message' })
}

export const errorMessage = (message) => {
    toast.error(message, { containerId: 'message' })
}

export const updateToastMessage = (toastId, message) => {
    toast.update(toastId, {
        render: message,
        containerId : 'message'
    });
}

export const dissmissToast = (toastId) => {
    toast.dismiss(toastId)
}
export const jobMessageToNotificationCenter = (jobType, data) => {
    toast.info(jobType, { data: data, containerId: 'jobs', type: 'jobs' })
}