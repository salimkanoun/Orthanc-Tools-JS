import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import AnonTool from './AnonTool'
import ExportTool from './ExportTool'
import NotificationCenter from '../NotificationCenter/NotificationCenter'


export default ({ roles }) => {

    const [show, setShow] = useState('')

    const store = useSelector(state => {
        return {
            deleteList: state.DeleteList.deleteList,
            studyArray: state.ExportList.studyArray,
            anonList: state.AnonList.anonList
        }
    })

    const closePopovers = () => {
        setShow('')
    }

    const refExport = React.createRef()
    const refAnon = React.createRef()
    const refDelete = React.createRef()
    return (
        <div className='d-flex justify-content-end align-items-center'>
            <div className="ms-1" hidden={!roles.anon}>
                <Link id='anon' ref={refAnon} type="button" className="btn otjs-btn-tools otjs-btn-tools-blue w-12"
                    onMouseOver={() => setShow('anon')} to='/anonymize'>
                    <i className="fas fa-user-secret me-2"></i> Anonymize
                    <span className="ms-2 badge bg-light text-dark"
                        onMouseOver={() => setShow('anon')}>{store.anonList.length}</span>
                </Link>
                <AnonTool target={refAnon} show={show === 'anon' ? true : false}
                    onHide={closePopovers} />
            </div>
            <div className="ms-1" hidden={!roles.exportRemote || !roles.exportLocal}>
                <Link id='export' ref={refExport} type="button" className="btn otjs-btn-tools otjs-btn-tools-orange w-12"
                    onMouseOver={() => setShow('export')} to='/export'>
                    <i className="fas fa-file-export me-2"></i> Export
                    <span className="ms-2 badge bg-light text-dark"
                        onMouseOver={() => setShow('export')}>{store.studyArray.length}</span>
                </Link>
                <ExportTool target={refExport} show={show === 'export' ? true : false}
                    onHide={closePopovers} />
            </div>
            <div className='ms-1'>
                <Link id='delete' ref={refDelete} type='button' className='btn otjs-btn-tools otjs-btn-tools-red' to='/delete'>
                    Delete <span className="badge bg-light text-dark">{store.deleteList.length}</span>
                </Link>
            </div>
            <div className='ms-1'>
                <NotificationCenter />
            </div>

        </div>
    )
}



