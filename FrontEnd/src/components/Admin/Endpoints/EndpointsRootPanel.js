import FtpEndpoints from './FtpEndpointsList'
import React, { useState, useEffect, Fragment } from 'react'
import apis from '../../../services/apis'
import SftpEndpoints from './SftpEndpointsList'
import WebdavEndpoints from './WebdavEndpoint'
import EndpointForm from './EndpointForm'
import SecurityRootPanel from './Security/SecurityRootPanel'
import { toast } from 'react-toastify'
import EndpointsOptions from './EndpointsOptions'

const EndpointRootPanel = () => {

    const [endpoints, setEndpoints] = useState({
        ftp: [],
        sftp: [],
        webdav: []
    })

    const [currentComponent, setcurrentComponent] = useState('endpoints')


    /**
     * Replacement of ComponentDidMount
     * See https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n
     */
    useEffect(() => {
        refreshEndpoints()
    }, [])


    let getComponentToDisplay = () => {
        let component = null
        switch (currentComponent) {
            case 'endpoints':
                component =
                    <Fragment>
                        <FtpEndpoints endpointsData={endpoints.ftp} onDeleteEndpoint={onDeleteEndpoint} />
                        <SftpEndpoints endpointsData={endpoints.sftp} onDeleteEndpoint={onDeleteEndpoint} />
                        <WebdavEndpoints endpointsData={endpoints.webdav} onDeleteEndpoint={onDeleteEndpoint} />
                        <EndpointsOptions/>
                    </Fragment>
                break
            case 'add':
                component = <EndpointForm onCreateEndpoint={onCreateEndpoint} />
                break
            case 'security':
                component = <SecurityRootPanel />
                break
            default:
                break
        }

        return component
    }

    let refreshEndpoints = async () => {
        let answer 
        try {
            answer = await apis.endpoints.getEndpoints()
        } catch (error){
            toast.error(error.statusText)
            return
        }

        let endpoints = {
            ftp: [],
            sftp: [],
            webdav: []
        }
        answer.forEach((endpoint) => {
            switch (endpoint.protocol) {
                case 'ftp':
                case 'ftps':
                    endpoints.ftp.push(endpoint)
                    break;
                case 'sftp':
                    endpoints.sftp.push(endpoint)
                    break;
                case 'webdav':
                    endpoints.webdav.push(endpoint)
                    break;
                default:
                    break;
            }
        });
        setEndpoints(endpoints)
    }

    let switchTab = (name) => {
        setcurrentComponent(name)
    }

    let onDeleteEndpoint = async (id)=> {
        try{
            await apis.endpoints.deleteEndpoints(id)
            await refreshEndpoints()
        } catch(error){
            toast.error(error.statusText)
        }
        
    }

    let onCreateEndpoint = async (postData)=>{

        try{
            await apis.endpoints.createEndpoint(postData)
            await refreshEndpoints()
            switchTab('endpoints')
            toast.success('Endpoint Created')
        } catch(error){
            toast.error(error.statusText)
        }

       

    }
    return (
        <>
            <div>
                <div className='mb-5'>
                    <nav className="otjs-navmenu container-fluid">
                        <div className="otjs-navmenu-nav">
                            <li className='col-4 text-center'>
                                <button
                                    className={currentComponent === 'endpoints' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => switchTab('endpoints')}>Endpoints
                                </button> 
                            </li>
                            <li className='col-4 text-center'>
                                <button
                                    className={currentComponent === 'add' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => switchTab('add')}>Add Endpoints
                                </button> 
                            </li>
                            <li className='col-4 text-center'>
                                <button
                                    className={currentComponent === 'security' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => switchTab('security')}>Security
                                </button> 
                            </li>
                        </div>
                    </nav>
                </div>
                <div>
                    {getComponentToDisplay()}
                </div>
            </div>
        </>
    )
}

export default EndpointRootPanel