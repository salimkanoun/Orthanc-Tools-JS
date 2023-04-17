import React, { useState, Fragment } from 'react'
import { Button } from 'react-bootstrap'

import apis from '../../../services/apis'
import SftpEndpoints from './SftpEndpointsList'
import WebdavEndpoints from './WebdavEndpoint'
import EndpointForm from './EndpointForm'
import FtpEndpoints from './FtpEndpointsList'
import SecurityRootPanel from './Security/SecurityRootPanel'
import EndpointsOptions from './EndpointsOptions'

import { useCustomMutation, useCustomQuery } from '../../CommonComponents/ReactQuery/hooks'
import { keys } from '../../../model/Constant'
import Spinner from '../../CommonComponents/Spinner'

export default () => {

    const [currentComponent, setcurrentComponent] = useState('endpoints')

    const {data : endpoints, isLoading} = useCustomQuery(
        [keys.ENDPOINTS_KEY],
        () => apis.endpoints.getEndpoints(),
        undefined,
        (answer) => {
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
            })
            return endpoints
        }
    )

    const getComponentToDisplay = () => {
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

    const switchTab = (name) => {
        setcurrentComponent(name)
    }


    const onDeleteEndpoint = useCustomMutation(
        ({id}) => apis.endpoints.deleteEndpoints(id),
        [[keys.ENDPOINTS_KEY]]
    )

    const onCreateEndpoint = useCustomMutation(
        ({postData}) => {apis.endpoints.createEndpoint(postData)
        switchTab('endpoints')},
        [[keys.ENDPOINTS_KEY]]
    )


    if (isLoading) return <Spinner/>

    return (
        <>
            <div>
                <div className='mb-5'>
                    <nav className="otjs-navmenu container-fluid">
                        <div className="otjs-navmenu-nav">
                            <li className='col-4 text-center'>
                                <Button
                                    className={currentComponent === 'endpoints' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => switchTab('endpoints')}>Endpoints
                                </Button> 
                            </li>
                            <li className='col-4 text-center'>
                                <Button
                                    className={currentComponent === 'add' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => switchTab('add')}>Add Endpoints
                                </Button> 
                            </li>
                            <li className='col-4 text-center'>
                                <Button
                                    className={currentComponent === 'security' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => switchTab('security')}>Security
                                </Button> 
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