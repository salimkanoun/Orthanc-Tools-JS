import React, { useState } from 'react'

export default ({ previousPassword, onUpdate }) => {

    const [password, setPassword] = useState('')

    const componentDidMount = () => {
        if (previousPassword != null) {
            setPassword(previousPassword)
        }
    }

    const changeListener = (event) => {
        if (event.target !== null) {
            setPassword(event.target.value)
        }
    }

    return (
        <input name='password' type="password" className="form-control" placeholder="password" onBlur={() => { onUpdate(password) }} value={password} onChange={changeListener}></input>
    );
}