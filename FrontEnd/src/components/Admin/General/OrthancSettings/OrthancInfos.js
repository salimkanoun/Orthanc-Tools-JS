import React, { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import apis from '../../../../services/apis';

export default ({ }) => {

    const [plugins, setPlugins] = useState([]);
    const [system, setSystem] = useState([])

    useEffect(() => {
        const functionAwait = async() => {
            let orthancSystem = await apis.options.getOrthancSystem()
            let plugins = await apis.options.getPlugins()
            generatePluginList(plugins)
            generateSystemList(orthancSystem)
        }

        functionAwait()
    }, []);

    const generatePluginList = (data) => {
        let list = []
        data.forEach(element => list.push(<li key={element}>{element}</li>))
        setPlugins(list)

    }

    const generateSystemList = (data) => {

        let list = []
        Object.entries(data).forEach(([key, value]) => {
            list.push(<li key={key}>{key + ' : ' + value}</li>)
        })
        setSystem(list)
    }


    return (
        <Fragment>
            <h3 className="card-title">System</h3>
            <ul>
                {system}
            </ul>
            <h3 className="card-title">Plugins</h3>
            <ul>
                {plugins}
            </ul>
        </Fragment>
    );

}