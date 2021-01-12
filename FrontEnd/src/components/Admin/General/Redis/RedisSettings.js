import React, { Component, Fragment } from 'react'

export default class RedisSettings extends Component {

    /** Init State */
    state = {
        redisAddress : 'localhost',
        resdisPort : 6379
    }

    /**
     * Fetch value from BackEnd
     */
    componentDidMount = async () => {
       //TO DO GET INFOS FROM BACKEND
    }

    render = () => {
        return (
            <Fragment>
                <div className="form-group">
                    <h2 className="card-title">Redis Server</h2>
                    <label htmlFor="address">Address : </label>
                    <input type='text' name="redisAddress" className="form-control" value={this.state.redisAddress} placeholder="" disabled />
                    <label htmlFor="port">Port : </label>
                    <input type='number' min="0" max="999999" name="redisPort" className="form-control" value={this.state.resdisPort} disabled />
                </div>
            </Fragment>
        )
    }
}
