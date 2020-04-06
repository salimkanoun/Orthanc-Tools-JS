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
            Peer = this.state.peerName, 
            URL = this.state.ip + this.state.port, 
            User = this.state.username, 
            Pass = this.state.password
        }

        await apis.updatePeer(this.state.name, putData)

        this.props.refreshPerrData()
    }


    render(){
        return (
            <Fragment>
                <h2 className="card-title">Add Peer</h2>
                <div className="form-group">
                    <label htmlFor="name">Name : </label>
                    <input type='text' name="name" className="row form-control"/>
                    <label htmlFor="username">Username : </label>
                    <input type='text' name="username" className="row form-control"/>
                    <label htmlFor="password">Password : </label>
                    <input type='password' name="password" className="row form-control"/>
                    <label htmlFor="peerName">Peer name : </label>
                    <input type='text' name="peerName" className="row form-control"/>
                    <label htmlFor="ip">IP : </label>
                    <input type='text' name="ip" className="row form-control"/>
                    <label htmlFor="port">Port : </label>
                    <input type='number' name="port" className="row form-control"/>
                </div>
                <div className="text-right mb-5">
                    <input type='button' className='Row btn btn-primary' onclick={this.handleClick} value='send'/>
                </div>

            </Fragment>
        )
    }
}
