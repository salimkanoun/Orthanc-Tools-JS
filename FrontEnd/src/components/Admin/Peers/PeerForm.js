import React, { Component, Fragment } from 'react'
import { toast } from 'react-toastify'
import apis from '../../../services/apis'

/**
 * Form to declare or modify an Orthanc Peer
 */
export default class PeerForm extends Component {

    /**
     * Fill input text of users in current state
     * @param {*} event 
     */
    handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.value

        this.setState({
            [name]: value
        })

    }

    /**
     * Listener on form submission
     */
    handleClick = async () => {
        try {
            await apis.peers.updatePeer(this.state.name, this.state.ip, this.state.port, this.state.username, this.state.password)
            this.props.refreshPeerData()
        } catch (error) {
            toast.error(error.statusText)
        }

    }


    render = () => {
        return (
            <Fragment>
                <h2 className="card-title">Add Peer</h2>
                <div className="form-group">
                    <label htmlFor="username">Peer Name : </label>
                    <input type='text' name="name" className="form-control" onChange={this.handleChange} />
                    <label htmlFor="ip">Url : </label>
                    <input type='text' name="ip" className="form-control" placeholder="http://" onChange={this.handleChange} />
                    <label htmlFor="port">Port : </label>
                    <input type='number' name="port" className="form-control" onChange={this.handleChange} />
                    <label htmlFor="name">Username : </label>
                    <input type='text' name="username" className="form-control" onChange={this.handleChange} />
                    <label htmlFor="password">Password : </label>
                    <input type='password' name="password" className="form-control" onChange={this.handleChange} />
                </div>
                <div className="text-right mb-5">
                    <input type='button' className='btn btn-primary' onClick={this.handleClick} value='send' />
                </div>

            </Fragment>
        )
    }
}
