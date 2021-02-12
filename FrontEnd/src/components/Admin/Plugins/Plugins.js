import React, { Component, Fragment } from 'react'
import { toast } from 'react-toastify';
import apis from '../../../services/apis';

export default class Plugins extends Component {

    state = {
        plugins: []
    }

    componentDidMount = () => {
        //Fetch plugin list from backend
        apis.options.getPlugins().then(plugins => {
            let answer = []
            plugins.forEach(element => answer.push(<li key={element}>{element}</li>))
            this.setState({ plugins: answer })
        }).catch((error) => { toast.error(error.statusText) })
    }

    render = () => {
        return (
            <Fragment>
                <h2 className="card-title">Installed plugins</h2>
                <ul>
                    {this.state.plugins}
                </ul>
            </Fragment>
        );
    }
}