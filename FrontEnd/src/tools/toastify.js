import { toast } from 'react-toastify'

export const successMessage = (message) => {
    toast.success(message, { containerId: 'message' })
}

export const errorMessage = (message) => {
    toast.error(message, { containerId: 'message' })
}