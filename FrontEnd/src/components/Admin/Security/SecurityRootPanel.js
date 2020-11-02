import React, { useState, useEffect } from 'react'
import apis from '../../../services/apis'
import CertificateForm from './CertificateForm'
import Certificates from './CertificatesList'
import SshKeyForm from './SshKeyForm'
import SshKeys from './SshKeysList'

const SecurityRootPanel = ()=>{
    const [certificates, setCertificates] = useState([])
    const [sshKeys, setSshKeys] = useState([])
    
    /**
     * Replacement of ComponentDidMount
     * See https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n
     */
  useEffect(() => {
    refreshSshKeys()
    refreshCertificates()
  }, [])
  
  async function refreshSshKeys(){
      const answere = await apis.sshKeys.getKeysExpend()
      setSshKeys(answere)
  }

  async function refreshCertificates(){
    const answere = await apis.certificates.getCertificatesExpend()
    setCertificates(answere)
  }  

  return(
    <>
        <h2>Ssh Private Keys : </h2>
        <SshKeys sshKeysData={sshKeys} refreshSshKeysData={refreshSshKeys} />
        <SshKeyForm refreshSshKeysData={refreshSshKeys} />
        <h2>Certification Authorities : </h2>
        <Certificates certificatesData={certificates} refreshCertificatesData={refreshCertificates} />
        <CertificateForm refreshCertificatesData={refreshCertificates} />
    </>
  )
}

export default SecurityRootPanel