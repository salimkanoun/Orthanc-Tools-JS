import React, { Component, Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import apis from '../../../../services/apis'
export default () => {

    const [redisAddress, setRedisAddress] = useState('localhost')
    const [redisPort, setRedisPort] = useState(6379)
    const [redisPassword, setRedisPassword] = useState('')

    useEffect(() => {
        functionUseEffect()
    }, {})

    const functionUseEffect = async () => {
        try {
            let answer = await apis.options.getRedisServer()
            setRedisAddress(answer.redisAddress)
            setRedisPort(answer.redisPort)
            setRedisPassword(answer.redisPassword)
        } catch (error) {
            toast.error(error.statusText, { data: { type: 'notification' } })
        }
    }


    return (
        <Fragment>
            <div className="form-group">
                <h2 className="card-title">Redis Server</h2>
                <label htmlFor="redisAddress">Address : </label>
                <input type='text' name="redisAddress" className="form-control" value={redisAddress} placeholder="" disabled />
                <label htmlFor="redisPort">Port : </label>
                <input type='number' min="0" max="999999" name="redisPort" className="form-control" value={redisPort} disabled />
                <label htmlFor="redisPassword">Password : </label>
                <input type='password' name="redisPassword" className="form-control" value={redisPassword} disabled />
            </div>
        </Fragment>
    )
}
