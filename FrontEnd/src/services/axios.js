import axios from 'axios'
import store from '../myStore'

axios.interceptors.request.use((req)=> {
    req.headers.Authorization = 'Bearer '+ getToken()
    return req
})

const getToken = () => {
    return store?.getState().OrthancTools.token
}

export default axios