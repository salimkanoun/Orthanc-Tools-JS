import React, { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import apis from '../../../../services/apis';
import { useCustomQuery } from '../../../CommonComponents/ReactQuery/hooks';

export default ({ }) => {

    const { data: plugins, isLoading: isLoadingPlugins } = useCustomQuery(
        ['plugins'],
        () => apis.options.getPlugins(),
        undefined,
        (answer) => {
            return answer.map((element) => {
                return <li key={element}>{element}</li>
            }
            )
        }
    )

    const { data: system, isLoading: isLoadingSystem } = useCustomQuery(
        ['system'],
        () => apis.options.getOrthancSystem(),
        undefined,
        (answer) => {
            return Object.entries(answer).map(([key, value]) => {
                return <li key={key}>{key + ' : ' + value}</li>
            }
            )
        }
    )

    if (isLoadingPlugins) return "Loading ..."
    if (isLoadingSystem) return "Loading..."


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