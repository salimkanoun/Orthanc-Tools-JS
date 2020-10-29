import FtpEndpoints from './FtpEndpointsList'
import React, { useState, useEffect } from 'react'
import apis from '../../../services/apis'
import SftpEndpoints from './SftpEndpointsList'
import WebdavEndpoints from './WebdavEndpoint'
import EndpointForm from './EndpointForm'

const EndpointsRootPanel = ()=>{
    const [endpoints, setEndpoints] = useState({
        ftp : [],
        sftp : [],
        webdav : []
    })
    

    /**
     * Replacement of ComponentDidMount
     * See https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n
     */
  useEffect(() => {
    refreshEndpoints()
  }, [])
  
  async function refreshEndpoints(){
      const answer = await apis.endpoints.getEndpoints()
        let endpoints = {
            ftp : [],
            sftp : [],
            webdav : []
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
  return(
    <>
    <FtpEndpoints endpointsData={endpoints.ftp} refreshEndpointsData={refreshEndpoints}/>
    <SftpEndpoints endpointsData={endpoints.sftp} refreshEndpointsData={refreshEndpoints}/>
    <WebdavEndpoints endpointsData={endpoints.webdav} refreshEndpointsData={refreshEndpoints}/>
    <EndpointForm refreshEndpointsData={refreshEndpoints}/>
    </>
  )
}

export default EndpointsRootPanel