import React, { useState, Fragment } from 'react'
import { Button } from 'react-bootstrap'
import { keys } from '../../../../model/Constant'
import apis from '../../../../services/apis'
import CertificateForm from './CertificateForm'
import Certificates from './CertificatesList'
import SshKeyForm from './SshKeyForm'
import SshKeys from './SshKeysList'
import Spinner from '../../../CommonComponents/Spinner'
import { useCustomQuery } from '../../../../services/ReactQuery/hooks'

export default () => {

    const [currentComponent, setCurrentComponent] = useState("sshKeys")

    /**
     * Replacement of ComponentDidMount
     * See https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n
     */

    const {data : sshKeys, isLoading : isLoadingSsh} = useCustomQuery(
        [keys.SSH_KEY],
        () => apis.sshKeys.getKeysExpend()
    )

    const {data : certificates, isLoading : isLoadingCertificates} = useCustomQuery(
        [keys.CERTIFICATES_KEY],
        () => apis.certificates.getCertificatesExpend()
    )


    let getComponentToDisplay = () => {
        let component = null
        switch (currentComponent) {
            case 'sshKeys':
                component =
                    <Fragment>
                        <h2 className="card-title">Ssh Private Keys : </h2>
                        <SshKeys sshKeysData={sshKeys} />
                        <SshKeyForm />
                    </Fragment>
                break
            case 'certificates':
                component =
                    <Fragment>
                        <h2 className="card-title">Certification Authorities : </h2>
                        <Certificates certificatesData={certificates} />
                        <CertificateForm />
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

    if (isLoadingCertificates || isLoadingSsh) return <Spinner/>

    return (
        <>
            <div>
                <div className='mb-5'>
                    <nav className="otjs-navmenu container-fluid">
                        <div className="otjs-navmenu-nav">
                            <li className='col-6 text-center'>
                                <Button
                                    className={currentComponent === 'sshKeys' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => switchTab('sshKeys')}>Ssh Keys
                                </Button> 
                            </li>
                            <li className='col-6 text-center'>
                                <Button
                                    className={currentComponent === 'certificates' ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => switchTab('certificates')}>Certificates
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

