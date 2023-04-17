import React, { Fragment } from 'react'
import apis from '../../../../services/apis';
import { useCustomMutation, useCustomQuery } from '../../../CommonComponents/ReactQuery/hooks';
import { keys } from '../../../../model/Constant';
import Spinner from '../../../CommonComponents/Spinner';
import Select from 'react-select';
import { errorMessage, successMessage } from '../../../../tools/toastify';

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
        [[keys.ORTHANC_VERBOSITY_KEY]],
        () => successMessage('Updated'),
        () => errorMessage('Update Failed')
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

    if (isLoadingSystem || isLoadingPlugins) return <Spinner />

    const getSystemComponents = () => {
        if (system == null) return null
        return Object.entries(system).map(([key, value]) => <li key={key}>{key + ' : ' + value}</li>)
    }

    const getPluginComponents = () => {
        if (plugins == null) return null
        return plugins.map((element) => <li key={element}>{element}</li>)
    }

    return (
        <Fragment>
            <h3 className="card-title">System</h3>
            <ul>
                {
                    getSystemComponents()
                }
            </ul>
            <h3 className="card-title">Plugins</h3>
            <ul>
                {
                    getPluginComponents()
                }
            </ul>
            <Select value={verbosities.find((verbosityOption) => verbosityOption.value === verbosity)} options={verbosities} onChange={onVerbosityChange} />
        </Fragment>
    );
}