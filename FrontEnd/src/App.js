import React from 'react'

import Authentication from './components/Authentication'

import { login, logout } from './actions/login'
import { useSelector, useDispatch } from 'react-redux'
import apis from './services/apis'

import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

//CSS Boostrap
import 'bootstrap/dist/css/bootstrap.min.css'
//CSS Toastify
import 'react-toastify/dist/ReactToastify.css'
//Custom CSS
import './assets/styles/orthancToolsJs.scss'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router-dom'
import MainRoot from './components/Main/MainRoot'

// Configuring Toastify params that will be used all over the app
const App = () => {

    const dispatch = useDispatch()
    const username = useSelector((state) => state.OrthancTools.username)
    const roles = useSelector((state) => state.OrthancTools.roles)


    const onLogin = (token, backendData) => {
        dispatch(login(token, backendData))
    }

    const onLogout = async () => {
        dispatch(logout()) //empty all reducer
        await apis.authentication.logOut() //ask backend to reset cookie http only
    }


    const queryClient = new QueryClient();

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <div >
                    <ToastContainer
                        enableMultiContainer
                        containerId={'message'}
                        position={'bottom-right'}
                        autoClose={5000}
                        newestOnTop
                        closeOnClick
                    > </ToastContainer>
                    <ToastContainer
                        enableMultiContainer
                        containerId={'jobs'}
                        position={'bottom-left'}
                        autoClose={5000}
                        newestOnTop
                        closeOnClick
                    > </ToastContainer>
                </div>
                {username ?
                    <MainRoot onLogout={onLogout} username={username} roles={roles} />
                    :
                    <Authentication onLogin={onLogin} />}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </BrowserRouter>
    );

}

export default App;