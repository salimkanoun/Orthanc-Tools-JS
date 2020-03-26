import { toast } from 'react-toastify'

export function toastifySuccess (message) {
  toast.success(message)
}

export function toastifyError (message) {
  toast.error(message)
}
