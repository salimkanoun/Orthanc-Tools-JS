import { toast } from 'react-toastify'

//SK SERT PAS A GRAND CHOSE A ENLEVER
export function toastifySuccess (message) {
  toast.success(message)
}

export function toastifyError (message) {
  toast.error(message)
}
