import React, {Component, Fragment} from 'react'
import apis from '../../services/apis'

/**
 * Form to declare or modify PEER
 */

export default class PeerForm extends Component{

    constructor(props){
        super(props)
        this.handleClick=this.handleClick.bind(this)
        this.handleChange=this.handleChange.bind(this)
    }
    /**
     * Fill input text of users in current state
     * @param {*} event 
     */
    handleChange(event) {
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
    async handleClick(){
        let putData = {
            Peer: this.state.peerName, 
            Host: this.state.ip + ":" + this.state.port, 
            User: this.state.username, 
            Pass: this.state.password
        }

        await apis.peers.updatePeer(this.state.name, putData)

        this.props.refreshPeerData()
    }


    render(){
        return (
            <Fragment>
                <h2 className="card-title">Add Peer</h2>
                <div className="form-group">
                    <label htmlFor="name">Name : </label>
                    <input type='text' name="name" className="row form-control" onChange={this.handleChange}/>
                    <label htmlFor="username">Username : </label>
                    <input type='text' name="username" className="row form-control" onChange={this.handleChange}/>
                    <label htmlFor="password">Password : </label>
                    <input type='password' name="password" className="row form-control" onChange={this.handleChange}/>
                    <label htmlFor="peerName">Peer name : </label>
                    <input type='text' name="peerName" className="row form-control" onChange={this.handleChange}/>
                    <label htmlFor="ip">IP : </label>
                    <input type='text' name="ip" className="row form-control" onChange={this.handleChange}/>
                    <label htmlFor="port">Port : </label>
                    <input type='number' name="port" className="row form-control" onChange={this.handleChange}/>
                </div>
                <div className="text-right mb-5">
                    <input type='button' className='Row btn btn-primary' onClick={this.handleClick} value='send'/>
                </div>

            </Fragment>
        )
    }
}
