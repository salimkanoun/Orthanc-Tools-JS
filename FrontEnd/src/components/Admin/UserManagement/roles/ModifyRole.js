import React, { Fragment, useState } from 'react'
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

import apis from '../../../../services/apis';
import RoleForm from './RoleForm';



export default ({ propsName }) => {

    const [show, setShow] = useState(false)
    const [data, setData] = useState({})

    const modify = (roleFormState) => {
        let permission = {
            ...roleFormState,
            name: propsName
        }
        apis.role.modifyRole(permission).then(() => {
            toast.success('Modified', {data:{type:'notification'}})
            setShow(false)
        }).catch(error => toast.error(error.statusText, {data:{type:'notification'}}))
    }

    const handleClick = () => {
        let permission = {}
        apis.role.getPermission(propsName).then(answer => permission = answer[0]).then(() => {
            setData({ ...permission })
            setShow(true)

        }).catch(error => toast.error(error.statusText, {data:{type:'notification'}}))
    }

    return (
        <Fragment>
            <div className="text-center">
                <Button className='otjs-button otjs-button-orange' name='openModify' onClick={handleClick}>Edit</Button>
            </div>

            <Modal id='modify' show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <h2 className='card-title'>Modify role {data.name}</h2>
                </Modal.Header>
                <Modal.Body>
                    <RoleForm data={data} onSubmitRole={modify} />
                </Modal.Body>
            </Modal>
        </Fragment>

    );
}