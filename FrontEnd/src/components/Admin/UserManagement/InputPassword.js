import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'

export default ({ previousPassword, onUpdate }) => {

    const [password, setPassword] = useState('')

    useEffect(() => {
        if (previousPassword != null) {
            setPassword(previousPassword)
        }
    }, [])


    const changeListener = (event) => {
        if (event.target !== null) {
            setPassword(event.target.value)
        }
    }

    return (
        <Form.Control type="password" placeholder="password" onBlur={() => { onUpdate(password) }} value={password} onChange={changeListener}/>
    );
}