import React, { Component, Fragment } from 'react'
import { toast } from 'react-toastify';
import apis from '../../../services/apis';

export default class Plugins extends Component {

    state = {
        plugins: [],
        system: {}
    }

    componentDidMount = async () => {
        //Fetch plugin list from backend
        let orthancSystem = null
        let plugins = null
        try {
            orthancSystem = await apis.options.getOrthancSystem()
            plugins = await apis.options.getPlugins()
        } catch (error) {
            toast.error(error.statusText)
        }

        let answer = []
        plugins.forEach(element => answer.push(<li key={element}>{element}</li>))
        this.setState({
            plugins: answer,
            system: orthancSystem
        })
    }

    render = () => {
        return (
            <Fragment>
                <h3 className="card-title">System</h3>
                <ul>
                    {JSON.stringify(this.state.system, null, 2)}
                </ul>
                <h3 className="card-title">Plugins</h3>
                <ul>
                    {this.state.plugins}
                </ul>
            </Fragment>
        );
    }
}