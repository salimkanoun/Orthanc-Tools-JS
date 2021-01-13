import FtpEndpoints from './FtpEndpointsList'
import React, { useState, useEffect, Fragment } from 'react'
import apis from '../../../services/apis'
import SftpEndpoints from './SftpEndpointsList'
import WebdavEndpoints from './WebdavEndpoint'
import EndpointForm from './EndpointForm'
import SecurityRootPanel from './Security/SecurityRootPanel'

export default () => {

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
                        <FtpEndpoints endpointsData={endpoints.ftp} refreshEndpointsData={refreshEndpoints} />
                        <SftpEndpoints endpointsData={endpoints.sftp} refreshEndpointsData={refreshEndpoints} />
                        <WebdavEndpoints endpointsData={endpoints.webdav} refreshEndpointsData={refreshEndpoints} />
                    </Fragment>
                break
            case 'add':
                component = <EndpointForm refreshEndpointsData={refreshEndpoints} />
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
        const answer = await apis.endpoints.getEndpoints()
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
    return (
        <>
            <div>
                <div className='mb-5'>
                    <ul className='nav nav-pills nav-fill'>
                        <li className='nav-item'>
                            <button className={currentComponent === 'endpoints' ? 'col nav-link active link-button' : 'col link-button'} onClick={() => switchTab('endpoints')}>Endpoints</button>
                        </li>
                        <li className='nav-item'>
                            <button className={currentComponent === 'add' ? 'col nav-link active link-button' : ' col link-button'} onClick={() => switchTab('add')}> Add Endpoints </button>
                        </li>
                        <li className='nav-item'>
                            <button className={currentComponent === 'security' ? 'col nav-link active link-button' : ' col link-button'} onClick={() => switchTab('security')}> Security </button>
                        </li>
                    </ul>
                </div>
                <div>
                    {getComponentToDisplay()}
                </div>
            </div>
        </>
    )
}