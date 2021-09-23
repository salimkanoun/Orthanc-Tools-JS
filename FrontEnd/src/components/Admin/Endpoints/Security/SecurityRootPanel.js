import React, { useState, useEffect, Fragment } from 'react'
import { toast } from 'react-toastify'
import apis from '../../../../services/apis'
import CertificateForm from './CertificateForm'
import Certificates from './CertificatesList'
import SshKeyForm from './SshKeyForm'
import SshKeys from './SshKeysList'

const SecurityRootPanel = () => {

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
        try{
            const answer = await apis.sshKeys.getKeysExpend()
            setSshKeys(answer)
        }catch(error){
            toast.error(error.statusText)
        }
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
                        <h2 className="card-title">Ssh Private Keys : </h2>
                        <SshKeys sshKeysData={sshKeys} refreshSshKeysData={refreshSshKeys} />
                        <SshKeyForm refreshSshKeysData={refreshSshKeys} />
                    </Fragment>
                break
            case 'certificates':
                component =
                    <Fragment>
                        <h2 className="card-title">Certification Authorities : </h2>
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
                    <nav className="otjs-navmenu container-fluid">
                        <div className="otjs-navmenu-nav">
                            <li className='col-6 text-center'>
                                <button
                                    className={currentComponent === 'sshKeys' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => switchTab('sshKeys')}>Ssh Keys
                                </button> 
                            </li>
                            <li className='col-6 text-center'>
                                <button
                                    className={currentComponent === 'certificates' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => switchTab('certificates')}>Certificates
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

export default SecurityRootPanel