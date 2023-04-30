import React from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from 'react-toastify'

import Authentication from './components/Authentication'
import MainRoot from './components/Main/MainRoot'
import ConfirmGlobal from './components/CommonComponents/ConfirmGlobal'

import { login, logout } from './actions/login'
import apis from './services/apis'

//CSS Boostrap
import 'bootstrap/dist/css/bootstrap.min.css'
//CSS Toastify
import 'react-toastify/dist/ReactToastify.css'
//progress bar
import 'react-circular-progressbar/dist/styles.css';
//Date Picker
import 'react-datepicker/dist/react-datepicker.css'
//React Calendar
import 'react-calendar/dist/Calendar.css';
//Custom CSS
import './assets/styles/orthancToolsJs.scss'
import ErrorBoundary from './ErrorBoundary';



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
            <ErrorBoundary>
                <QueryClientProvider client={queryClient}>
                    <ConfirmGlobal />
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
                            style={{ visibility: 'hidden' }}
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
            </ErrorBoundary>
        </BrowserRouter>
    );

}

export default App;