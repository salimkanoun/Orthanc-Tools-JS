import React, { Component, Fragment } from 'react'
import { toast } from 'react-toastify'

import apis from '../../../../services/apis'
export default class RedisSettings extends Component {

    /** Init State */
    state = {
        redisAddress: 'localhost',
        redisPort: 6379,
        redisPassword : ''
    }

    /**
     * Fetch value from BackEnd
     */
    componentDidMount = async () => {
        try {
            let answer = await apis.options.getRedisServer()
            this.setState({
                ...answer
            })
        } catch (error) {
            toast.error(error.statusText)
        }
    }

    render = () => {
        return (
            <Fragment>
                <div className="form-group">
                    <h2 className="card-title">Redis Server</h2>
                    <label htmlFor="redisAddress">Address : </label>
                    <input type='text' name="redisAddress" className="form-control" value={this.state.redisAddress} placeholder="" disabled />
                    <label htmlFor="redisPort">Port : </label>
                    <input type='number' min="0" max="999999" name="redisPort" className="form-control" value={this.state.redisPort} disabled />
                    <label htmlFor="redisPassword">Password : </label>
                    <input type='password' name="redisPassword" className="form-control" value={this.state.redisPassword} disabled />
                </div>
            </Fragment>
        )
    }
}
