import React, { Fragment } from 'react'
import apis from '../../../../services/apis';
import { useCustomMutation, useCustomQuery } from '../../../CommonComponents/ReactQuery/hooks';
import { keys } from '../../../../model/Constant';
import Spinner from '../../../CommonComponents/Spinner';
import Select from 'react-select';

export default () => {

    const verbosities = [
        { value: 'default', label: 'Default' },
        { value: 'verbose', label: 'Verbose' },
        { value: 'trace', label: 'Trace' }
    ]

    const { data: verbosity } = useCustomQuery(
        [keys.ORTHANC_VERBOSITY_KEY],
        () => apis.options.getVerbosity()
    )

    const updateVerbosity = useCustomMutation(
        ({ verbosity }) => apis.options.setVerbosity(verbosity),
        [[keys.ORTHANC_VERBOSITY_KEY]]
    )

    const onVerbosityChange = (selectedOption) => {
        let verbosity = selectedOption.value
        updateVerbosity.mutate({ verbosity })
    }

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

    if (isLoadingSystem || isLoadingPlugins) return <Spinner/>

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
            <Select value={verbosities.find((verbosityOption) => verbosityOption.value === verbosity)} options={verbosities} onChange={onVerbosityChange} />
        </Fragment>
    );
}