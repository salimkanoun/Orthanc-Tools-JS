import React, { Component, Fragment } from 'react'
import { toast } from 'react-toastify';
import apis from '../../../../services/apis';

export default class OrthancInfos extends Component {

    state = {
        plugins: [],
        system: []
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

        this.generatePluginList(plugins)
        this.generateSystemList(orthancSystem)

    }

    generatePluginList = (data) => {
        let list = []
        data.forEach(element => list.push(<li key={element}>{element}</li>))
        this.setState({
            plugins: list
        })

    }

    generateSystemList = (data) => {

        let list = []
        Object.entries(data).forEach( ([key, value]) => {
            list.push(<li key={key}>{key + ' : ' + value}</li>)
        })
        this.setState({
            system: list
        })

    }

    render = () => {
        return (
            <Fragment>
                <h3 className="card-title">System</h3>
                <ul>
                    {this.state.system}
                </ul>
                <h3 className="card-title">Plugins</h3>
                <ul>
                    {this.state.plugins}
                </ul>
            </Fragment>
        );
    }
}