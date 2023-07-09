import axios from 'axios'

import { logout } from '../actions/login'
import store from '../myStore'
import { errorMessage } from '../tools/toastify'

axios.interceptors.request.use((req) => {
    req.headers.Authorization = 'Bearer ' + getToken()
    return req
})

axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        const { status } = error.response
        const urlString = error?.response?.config?.url
        if (status === 401 && urlString && !urlString.startsWith('/api/authentication')) {
            // Singleton toast using fixed id to avoid multiple toast if multiple api call are 401
            errorMessage('Unauthorized answer, session is probably expired, please reidentify')
            //store.dispatch(logout())
        }
        return Promise.reject(error.response ?? error)
    }
)

export const getToken = () => {
    return store?.getState().OrthancTools.token
}

export default axios