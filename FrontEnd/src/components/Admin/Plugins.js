import React, { Component, Fragment } from 'react'
import apis from '../../services/apis';

class Plugins extends Component {
    state = {plugins: []}

    componentDidMount() {
        this.getPlugins()
    }
    

    async getPlugins(){
        let answer = []
        let plugins = await apis.options.getPlugins()
        plugins.forEach(element => answer.push(<li key={element}>{element}</li>))
        this.setState({plugins: answer})
    }

    render() {
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

export default Plugins;