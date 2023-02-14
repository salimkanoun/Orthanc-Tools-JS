import React, { Fragment } from 'react'
import apis from '../../../../services/apis';
import { useCustomQuery } from '../../../CommonComponents/ReactQuery/hooks';
import { keys } from '../../../../model/Constant';

export default () => {

    const { data: plugins, isLoading: isLoadingPlugins } = useCustomQuery(
        [keys.PLUGINS_KEY],
        () => apis.options.getPlugins(),
        undefined,
    )

    const { data: system, isLoading: isLoadingSystem } = useCustomQuery(
        [keys.PLUGINS_KEY],
        () => apis.options.getOrthancSystem(),
        undefined
    )

    if (isLoadingSystem || isLoadingPlugins) return "Loading ..."

    return (
        <Fragment>
            <h3 className="card-title">System</h3>
            <ul>
                {
                    Object.entries(system).map(([key, value]) => <li key={key}>{key + ' : ' + value}</li>)
                }
            </ul>
            <h3 className="card-title">Plugins</h3>
            <ul>
                {
                    plugins.map((element) => <li key={element}>{element}</li>)
                }
            </ul>
        </Fragment>
    );
}