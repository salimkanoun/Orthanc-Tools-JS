import React, { Component, Fragment } from 'react'
import { toast } from 'react-toastify';

export default class OrthancSettings extends Component {

    state = {
        address : '',
        port : 0,
        username : '',
        password : ''
    }
    

    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.testConnexion = this.testConnexion.bind(this)
    }

    async componentDidMount(){

        let answer = await fetch("/api/options/orthanc-server", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((answer) => {
            return (answer.json())
        })

        this.setState({
            address : answer.OrthancAdress,
            port : answer.OrthancPort,
            username : answer.OrthancUsername,
            password : answer.OrthancPassword
        })

    }

    handleChange(event) {
        const target = event.target
        const name = target.name
        const value = target.type === 'checkbox' ? target.checked : target.value
        
        this.setState({
            [name]: value
        })

    }

    async handleClick() {

        let postString = JSON.stringify({ address: this.state.address, 
                                        port: this.state.port,
                                        username : this.state.username,
                                        password : this.state.password })

        await fetch("/api/options/orthanc-server", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: postString
        })
    }

    async testConnexion () {

        await fetch("/api/options/orthanc-system", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((answer) => {
            return (answer.json())
        }).then((answer) => {
            toast.success('Orthanc Version : '+answer.Version, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }).catch((error) =>{

            toast.error('Orthanc Server Unreacheable', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });

        } )

    }

    render() {
        return (
            <Fragment>
                <div className="form-group">
                    <h2 className="card-title">Orthanc Server</h2>
                    <label htmlFor="address">Address : </label>
                    <input type='text' name="address" className="row form-control" onChange={this.handleChange} value={this.state.address} placeholder="http://" />
                    <label htmlFor="port">Port : </label>
                    <input type='number' min="0" max="999999" name="port" className="row form-control" value={this.state.port} onChange={this.handleChange} />
                    <label htmlFor="username">Username : </label>
                    <input type='text' name="username" className="row form-control" value={this.state.username} onChange={this.handleChange} />
                    <label htmlFor="password">Password : </label>
                    <input type='password' name="password" className="row form-control" value={this.state.password} onChange={this.handleChange} />
                </div>
                <div className="form-group text-right">
                    <input type='button' className='btn btn-primary' onClick={this.handleClick} value='Update' />
                    <input type='button' className='btn btn-info' onClick={this.testConnexion} value='Check Connexion' />
                </div>
            </Fragment>
        )
    }
}
