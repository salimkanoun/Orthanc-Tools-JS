import React, { useState, useEffect, Fragment } from 'react'
import { toast } from 'react-toastify'
import apis from '../../../../services/apis'
import CertificateForm from './CertificateForm'
import Certificates from './CertificatesList'
import SshKeyForm from './SshKeyForm'
import SshKeys from './SshKeysList'

export default () => {

    const [certificates, setCertificates] = useState([])
    const [sshKeys, setSshKeys] = useState([])
    const [currentComponent, setCurrentComponent] = useState("sshKeys")

    /**
     * Replacement of ComponentDidMount
     * See https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n
     */
    useEffect(() => {
        refreshSshKeys()
        refreshCertificates()
    }, [])

    let refreshSshKeys = async () => {
        const answere = await apis.sshKeys.getKeysExpend()
        setSshKeys(answere)
    }

    let refreshCertificates = async () => {
        try{
            const answer = await apis.certificates.getCertificatesExpend()
            setCertificates(answer)
        } catch (error) {
            toast.error(error.statusText)
        }

    }


    let getComponentToDisplay = () => {
        let component = null
        switch (currentComponent) {
            case 'sshKeys':
                component =
                    <Fragment>
                        <h2>Ssh Private Keys : </h2>
                        <SshKeys sshKeysData={sshKeys} refreshSshKeysData={refreshSshKeys} />
                        <SshKeyForm refreshSshKeysData={refreshSshKeys} />
                    </Fragment>
                break
            case 'certificates':
                component =
                    <Fragment>
                        <h2>Certification Authorities : </h2>
                        <Certificates certificatesData={certificates} refreshCertificatesData={refreshCertificates} />
                        <CertificateForm refreshCertificatesData={refreshCertificates} />
                    </Fragment>
                break
            default:
                break
        }

        return component
    }

    let switchTab = (tabName) => {
        setCurrentComponent(tabName)
    }

    return (
        <>
            <div>
                <div className='mb-5'>
                    <ul className='nav nav-pills nav-fill'>
                        <li className='nav-item'>
                            <button className={currentComponent === 'sshKeys' ? 'col nav-link active link-button' : 'col link-button'} onClick={() => switchTab('sshKeys')}>Ssh Keys</button>
                        </li>
                        <li className='nav-item'>
                            <button className={currentComponent === 'certificates' ? 'col nav-link active link-button' : ' col link-button'} onClick={() => switchTab('certificates')}>Certificates</button>
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